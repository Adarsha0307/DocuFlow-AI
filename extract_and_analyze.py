#!/usr/bin/env python3
"""
Download, extract, and analyze DocuFlow AI ZIP files from GitHub
This script will extract apps.zip and DocuFlow AI2.zip and display the complete structure
"""

import requests
import zipfile
import io
import os
import json
from pathlib import Path
from typing import Dict, List

def download_and_extract_zip(url: str, extract_path: str = ".") -> bool:
    """Download ZIP from URL and extract to specified path"""
    print(f"\n📥 Downloading from: {url}")
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        print(f"✅ Downloaded ({len(response.content) / 1024 / 1024:.2f} MB)")
        
        with zipfile.ZipFile(io.BytesIO(response.content)) as zip_ref:
            zip_ref.extractall(extract_path)
        print(f"✅ Extracted to: {extract_path}")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def build_file_tree(path: str, prefix: str = "", max_depth: int = 5, current_depth: int = 0) -> List[str]:
    """Build a tree structure of files and directories"""
    if current_depth >= max_depth:
        return []
    
    lines = []
    try:
        items = sorted(os.listdir(path))
        # Filter out common non-essential directories
        skip_dirs = {'.git', '__pycache__', 'node_modules', '.pytest_cache', '.venv', 'venv', '.ruff_cache', 'dist', 'build'}
        items = [i for i in items if i not in skip_dirs and not i.startswith('.')]
        
        dirs = [i for i in items if os.path.isdir(os.path.join(path, i))]
        files = [i for i in items if os.path.isfile(os.path.join(path, i))]
        
        # Files first
        for i, file in enumerate(files):
            is_last = (i == len(files) - 1) and len(dirs) == 0
            lines.append(f"{prefix}{'└── ' if is_last else '├── '}{file}")
        
        # Then directories
        for i, dir_name in enumerate(dirs):
            is_last = i == len(dirs) - 1
            lines.append(f"{prefix}{'└── ' if is_last else '├── '}{dir_name}/")
            
            # Recursively add subdirectories
            extension = "    " if is_last else "│   "
            sub_path = os.path.join(path, dir_name)
            lines.extend(build_file_tree(sub_path, prefix + extension, max_depth, current_depth + 1))
    except PermissionError:
        pass
    
    return lines

def list_all_files(path: str, extension: str = None) -> List[str]:
    """List all files recursively, optionally filtered by extension"""
    files = []
    for root, dirs, filenames in os.walk(path):
        # Skip certain directories
        dirs[:] = [d for d in dirs if d not in {'.git', '__pycache__', 'node_modules', '.pytest_cache', '.venv', 'venv', '.ruff_cache'}]
        
        for filename in sorted(filenames):
            if extension is None or filename.endswith(extension):
                rel_path = os.path.relpath(os.path.join(root, filename), path)
                files.append(rel_path)
    
    return sorted(files)

def analyze_code_files(base_path: str) -> Dict:
    """Analyze and categorize code files"""
    analysis = {
        "python_files": [],
        "typescript_files": [],
        "config_files": [],
        "markdown_files": [],
        "other_files": []
    }
    
    for file_path in list_all_files(base_path):
        full_path = os.path.join(base_path, file_path)
        
        if file_path.endswith('.py'):
            analysis["python_files"].append(file_path)
        elif file_path.endswith(('.ts', '.tsx')):
            analysis["typescript_files"].append(file_path)
        elif file_path.endswith(('.json', '.yml', '.yaml', '.toml', '.ini', '.env')):
            analysis["config_files"].append(file_path)
        elif file_path.endswith(('.md', '.txt')):
            analysis["markdown_files"].append(file_path)
        else:
            analysis["other_files"].append(file_path)
    
    return analysis

def extract_key_files(base_path: str, key_patterns: List[str]) -> Dict[str, str]:
    """Extract content of key files"""
    key_files = {}
    all_files = list_all_files(base_path)
    
    for pattern in key_patterns:
        for file_path in all_files:
            if pattern.lower() in file_path.lower():
                full_path = os.path.join(base_path, file_path)
                try:
                    if file_path.endswith(('.py', '.ts', '.tsx', '.json', '.yml', '.yaml', '.md')):
                        with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                            if len(content) < 50000:  # Only if file is reasonably sized
                                key_files[file_path] = content
                except Exception as e:
                    print(f"⚠️  Could not read {file_path}: {e}")
    
    return key_files

def print_section(title: str, content: str = "", char: str = "="):
    """Print a formatted section"""
    print(f"\n{char * 80}")
    print(f"  {title}")
    print(f"{char * 80}")
    if content:
        print(content)

def main():
    print("\n" + "="*80)
    print("  DocuFlow AI - ZIP File Extraction & Analysis")
    print("="*80)
    
    # GitHub raw URLs for ZIP files
    base_url = "https://raw.githubusercontent.com/Adarsha0307/DocuFlow-AI/main"
    
    zip_files = {
        "apps.zip": f"{base_url}/apps.zip",
        "DocuFlow AI2.zip": f"{base_url}/DocuFlow%20AI2.zip"
    }
    
    extracted_paths = {}
    
    # Download and extract ZIP files
    for zip_name, url in zip_files.items():
        extract_dir = f"./{zip_name.replace('.zip', '')}"
        print(f"\n{'='*80}")
        print(f"Processing: {zip_name}")
        print(f"{'='*80}")
        if download_and_extract_zip(url, extract_dir):
            extracted_paths[zip_name] = extract_dir
    
    # Analyze each extracted directory
    for zip_name, extract_dir in extracted_paths.items():
        if os.path.exists(extract_dir):
            print_section(f"📁 File Structure: {zip_name}", char="=")
            tree_lines = build_file_tree(extract_dir)
            for line in tree_lines[:100]:  # Limit output
                print(line)
            if len(tree_lines) > 100:
                print(f"\n... and {len(tree_lines) - 100} more items")
            
            # Analyze files
            print_section(f"📊 File Analysis: {zip_name}", char="-")
            analysis = analyze_code_files(extract_dir)
            
            print(f"\n📄 Python Files ({len(analysis['python_files'])}):")
            for f in sorted(analysis['python_files'])[:20]:
                print(f"   ✓ {f}")
            if len(analysis['python_files']) > 20:
                print(f"   ... and {len(analysis['python_files']) - 20} more")
            
            print(f"\n🔷 TypeScript Files ({len(analysis['typescript_files'])}):")
            for f in sorted(analysis['typescript_files'])[:20]:
                print(f"   ✓ {f}")
            if len(analysis['typescript_files']) > 20:
                print(f"   ... and {len(analysis['typescript_files']) - 20} more")
            
            print(f"\n⚙️  Config Files ({len(analysis['config_files'])}):")
            for f in sorted(analysis['config_files'])[:20]:
                print(f"   ✓ {f}")
            if len(analysis['config_files']) > 20:
                print(f"   ... and {len(analysis['config_files']) - 20} more")
    
    print_section("✅ Extraction & Analysis Complete!", char="=")
    print(f"\n📂 Files have been extracted to:")
    for zip_name, path in extracted_paths.items():
        print(f"   • {path}/")
    
    print(f"\n📝 Next steps:")
    print(f"   1. Review the extracted directories")
    print(f"   2. Open app/main.py or app/api/v1 routes for backend")
    print(f"   3. Open apps/web/app for frontend Next.js structure")
    print(f"   4. Check apps/api/requirements.txt for dependencies")

if __name__ == "__main__":
    # Check if requests is available
    try:
        import requests
    except ImportError:
        print("❌ requests library not found. Install with: pip install requests")
        exit(1)
    
    main()
