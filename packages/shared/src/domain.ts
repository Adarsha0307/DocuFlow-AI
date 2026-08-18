/**
 * Domain enums shared across frontend and backend contracts.
 * These mirror the Python enums in apps/api/app/models/enums.py
 */

export const JobStatus = {
  QUEUED: "queued",
  RUNNING: "running",
  PAUSED: "paused",
  AWAITING_APPROVAL: "awaiting_approval",
  COMPLETED: "completed",
  FAILED: "failed",
  RETRYING: "retrying",
  CANCELED: "canceled",
} as const;
export type JobStatus = (typeof JobStatus)[keyof typeof JobStatus];

export const RunStatus = {
  PENDING: "pending",
  RUNNING: "running",
  AWAITING_APPROVAL: "awaiting_approval",
  PAUSED: "paused",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELED: "canceled",
} as const;
export type RunStatus = (typeof RunStatus)[keyof typeof RunStatus];

export const StepStatus = {
  PENDING: "pending",
  QUEUED: "queued",
  RUNNING: "running",
  AWAITING_APPROVAL: "awaiting_approval",
  APPROVED: "approved",
  COMPLETED: "completed",
  FAILED: "failed",
  RETRYING: "retrying",
  SKIPPED: "skipped",
  CANCELED: "canceled",
} as const;
export type StepStatus = (typeof StepStatus)[keyof typeof StepStatus];

export const ApprovalState = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  REVISION_REQUESTED: "revision_requested",
  SKIPPED: "skipped",
  AUTO_APPROVED: "auto_approved",
} as const;
export type ApprovalState = (typeof ApprovalState)[keyof typeof ApprovalState];

export const ApprovalKind = {
  RESEARCH: "research",
  SCRIPT: "script",
  SCRIPT_REVISION: "script_revision",
  SCENE_BREAKDOWN: "scene_breakdown",
  IMAGE_SET: "image_set",
  VOICEOVER_SAMPLE: "voiceover_sample",
  THUMBNAIL: "thumbnail",
  METADATA: "metadata",
  FINAL_RENDER: "final_render",
  UPLOAD: "upload",
} as const;
export type ApprovalKind = (typeof ApprovalKind)[keyof typeof ApprovalKind];

export const Role = {
  OWNER: "owner",
  ADMIN: "admin",
  EDITOR: "editor",
  REVIEWER: "reviewer",
  VIEWER: "viewer",
  BILLING_ADMIN: "billing_admin",
  OPERATOR: "operator",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const WorkflowStage = {
  TOPIC_IDEATION: "topic_ideation",
  RESEARCH_COLLECTION: "research_collection",
  FACT_STRUCTURING: "fact_structuring",
  SCRIPT_GENERATION: "script_generation",
  SCRIPT_REVIEW: "script_review",
  SCENE_PLANNING: "scene_planning",
  PROMPT_GENERATION: "prompt_generation",
  IMAGE_GENERATION: "image_generation",
  IMAGE_QA: "image_qa",
  VOICEOVER_GENERATION: "voiceover_generation",
  SUBTITLE_GENERATION: "subtitle_generation",
  MUSIC_PREP: "music_prep",
  TIMELINE_ASSEMBLY: "timeline_assembly",
  RENDER: "render",
  THUMBNAIL_GENERATION: "thumbnail_generation",
  SEO_GENERATION: "seo_generation",
  UPLOAD_PREPARATION: "upload_preparation",
  UPLOAD: "upload",
  ANALYTICS_SYNC: "analytics_sync",
  RETENTION_FEEDBACK: "retention_feedback",
} as const;
export type WorkflowStage = (typeof WorkflowStage)[keyof typeof WorkflowStage];

export const AssetKind = {
  IMAGE: "image",
  VIDEO: "video",
  AUDIO: "audio",
  MUSIC: "music",
  SFX: "sfx",
  FONT: "font",
  THUMBNAIL: "thumbnail",
} as const;
export type AssetKind = (typeof AssetKind)[keyof typeof AssetKind];

export const PlanCode = {
  STARTER: "starter",
  PRO: "pro",
  STUDIO: "studio",
  AGENCY: "agency",
} as const;
export type PlanCode = (typeof PlanCode)[keyof typeof PlanCode];

export const AutomationMode = {
  FULL: "full",
  MANUAL: "manual",
  HYBRID: "hybrid",
} as const;
export type AutomationMode = (typeof AutomationMode)[keyof typeof AutomationMode];