import { WorkflowStage } from "./domain.js";

export interface StageMeta {
  stage: WorkflowStage;
  label: string;
  description: string;
  approvalKind: string | null;
}

export const WORKFLOW_STAGES: WorkflowStage[] = [
  WorkflowStage.TOPIC_IDEATION,
  WorkflowStage.RESEARCH_COLLECTION,
  WorkflowStage.FACT_STRUCTURING,
  WorkflowStage.SCRIPT_GENERATION,
  WorkflowStage.SCRIPT_REVIEW,
  WorkflowStage.SCENE_PLANNING,
  WorkflowStage.PROMPT_GENERATION,
  WorkflowStage.IMAGE_GENERATION,
  WorkflowStage.IMAGE_QA,
  WorkflowStage.VOICEOVER_GENERATION,
  WorkflowStage.SUBTITLE_GENERATION,
  WorkflowStage.MUSIC_PREP,
  WorkflowStage.TIMELINE_ASSEMBLY,
  WorkflowStage.RENDER,
  WorkflowStage.THUMBNAIL_GENERATION,
  WorkflowStage.SEO_GENERATION,
  WorkflowStage.UPLOAD_PREPARATION,
  WorkflowStage.UPLOAD,
  WorkflowStage.ANALYTICS_SYNC,
  WorkflowStage.RETENTION_FEEDBACK,
];

export const STAGE_META: Record<WorkflowStage, StageMeta> = {
  [WorkflowStage.TOPIC_IDEATION]: {
    stage: WorkflowStage.TOPIC_IDEATION,
    label: "Topic ideation",
    description: "Brainstorm and select a documentary topic",
    approvalKind: null,
  },
  [WorkflowStage.RESEARCH_COLLECTION]: {
    stage: WorkflowStage.RESEARCH_COLLECTION,
    label: "Research collection",
    description: "Gather sources and factual material",
    approvalKind: "research",
  },
  [WorkflowStage.FACT_STRUCTURING]: {
    stage: WorkflowStage.FACT_STRUCTURING,
    label: "Fact structuring",
    description: "Organize facts into a coherent outline",
    approvalKind: null,
  },
  [WorkflowStage.SCRIPT_GENERATION]: {
    stage: WorkflowStage.SCRIPT_GENERATION,
    label: "Script generation",
    description: "Write the narration script",
    approvalKind: null,
  },
  [WorkflowStage.SCRIPT_REVIEW]: {
    stage: WorkflowStage.SCRIPT_REVIEW,
    label: "Script review",
    description: "Human approval of the script draft",
    approvalKind: "script",
  },
  [WorkflowStage.SCENE_PLANNING]: {
    stage: WorkflowStage.SCENE_PLANNING,
    label: "Scene planning",
    description: "Break the script into scenes",
    approvalKind: null,
  },
  [WorkflowStage.PROMPT_GENERATION]: {
    stage: WorkflowStage.PROMPT_GENERATION,
    label: "Prompt generation",
    description: "Create image prompts per scene",
    approvalKind: null,
  },
  [WorkflowStage.IMAGE_GENERATION]: {
    stage: WorkflowStage.IMAGE_GENERATION,
    label: "Image generation",
    description: "Generate scene imagery",
    approvalKind: null,
  },
  [WorkflowStage.IMAGE_QA]: {
    stage: WorkflowStage.IMAGE_QA,
    label: "Image QA",
    description: "Score and approve generated images",
    approvalKind: "image_set",
  },
  [WorkflowStage.VOICEOVER_GENERATION]: {
    stage: WorkflowStage.VOICEOVER_GENERATION,
    label: "Voiceover generation",
    description: "Synthesize narration audio",
    approvalKind: "voiceover_sample",
  },
  [WorkflowStage.SUBTITLE_GENERATION]: {
    stage: WorkflowStage.SUBTITLE_GENERATION,
    label: "Subtitle generation",
    description: "Generate and sync subtitles",
    approvalKind: null,
  },
  [WorkflowStage.MUSIC_PREP]: {
    stage: WorkflowStage.MUSIC_PREP,
    label: "Music & SFX",
    description: "Pick background music and sound effects",
    approvalKind: null,
  },
  [WorkflowStage.TIMELINE_ASSEMBLY]: {
    stage: WorkflowStage.TIMELINE_ASSEMBLY,
    label: "Timeline assembly",
    description: "Assemble the video timeline",
    approvalKind: null,
  },
  [WorkflowStage.RENDER]: {
    stage: WorkflowStage.RENDER,
    label: "Render",
    description: "Render the final video",
    approvalKind: "final_render",
  },
  [WorkflowStage.THUMBNAIL_GENERATION]: {
    stage: WorkflowStage.THUMBNAIL_GENERATION,
    label: "Thumbnail",
    description: "Generate thumbnail options",
    approvalKind: "thumbnail",
  },
  [WorkflowStage.SEO_GENERATION]: {
    stage: WorkflowStage.SEO_GENERATION,
    label: "SEO metadata",
    description: "Title, description, tags and keywords",
    approvalKind: "metadata",
  },
  [WorkflowStage.UPLOAD_PREPARATION]: {
    stage: WorkflowStage.UPLOAD_PREPARATION,
    label: "Upload preparation",
    description: "Validate upload payload and policies",
    approvalKind: null,
  },
  [WorkflowStage.UPLOAD]: {
    stage: WorkflowStage.UPLOAD,
    label: "Upload",
    description: "Publish or schedule on YouTube",
    approvalKind: "upload",
  },
  [WorkflowStage.ANALYTICS_SYNC]: {
    stage: WorkflowStage.ANALYTICS_SYNC,
    label: "Analytics sync",
    description: "Sync performance data",
    approvalKind: null,
  },
  [WorkflowStage.RETENTION_FEEDBACK]: {
    stage: WorkflowStage.RETENTION_FEEDBACK,
    label: "Retention feedback",
    description: "Learn from content performance",
    approvalKind: null,
  },
};

export interface PlanDefinition {
  code: string;
  name: string;
  monthlyPriceUsd: number;
  monthlyVideos: number;
  maxProjects: number;
  maxMembers: number;
  maxChannels: number;
  maxRenderSeconds: number;
  storageGb: number;
  features: string[];
}

export const PLANS: Record<string, PlanDefinition> = {
  starter: {
    code: "starter",
    name: "Starter",
    monthlyPriceUsd: 29,
    monthlyVideos: 4,
    maxProjects: 6,
    maxMembers: 2,
    maxChannels: 1,
    maxRenderSeconds: 1800,
    storageGb: 10,
    features: ["720p renders", "Standard voices", "Mock providers"],
  },
  pro: {
    code: "pro",
    name: "Pro",
    monthlyPriceUsd: 79,
    monthlyVideos: 15,
    maxProjects: 30,
    maxMembers: 5,
    maxChannels: 3,
    maxRenderSeconds: 7200,
    storageGb: 50,
    features: ["1080p renders", "Premium voices", "Custom workflows"],
  },
  studio: {
    code: "studio",
    name: "Studio",
    monthlyPriceUsd: 199,
    monthlyVideos: 60,
    maxProjects: 100,
    maxMembers: 15,
    maxChannels: 10,
    maxRenderSeconds: 36000,
    storageGb: 250,
    features: ["4K renders", "All voices", "Priority queue"],
  },
  agency: {
    code: "agency",
    name: "Agency",
    monthlyPriceUsd: 499,
    monthlyVideos: 250,
    maxProjects: 500,
    maxMembers: 100,
    maxChannels: 50,
    maxRenderSeconds: 180000,
    storageGb: 1000,
    features: ["Everything in Studio", "API access", "White label"],
  },
};