#!/usr/bin/env python3
"""
Script to extract apps.zip and prepare files for commit
Run: python3 extract_apps.py
"""

import zipfile
import os
import shutil

# Extract the ZIP
zip_path = "apps.zip"
extract_path = "./"

print(f"Extracting {zip_path}...")
with zipfile.ZipFile(zip_path, 'r') as zip_ref:
    zip_ref.extractall(extract_path)

print("✓ Extraction complete!")
print("\nExtracted structure:")
for root, dirs, files in os.walk("apps"):
    level = root.replace("apps", "").count(os.sep)
    indent = " " * 2 * level
    print(f"{indent}{os.path.basename(root)}/")
    sub_indent = " " * 2 * (level + 1)
    for file in files[:5]:  # Show first 5 files per directory
        print(f"{sub_indent}{file}")
    if len(files) > 5:
        print(f"{sub_indent}... and {len(files) - 5} more files")
