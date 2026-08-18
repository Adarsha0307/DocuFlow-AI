import { z } from "zod";
import {
  ApprovalKind,
  ApprovalState,
  AutomationMode,
  JobStatus,
  PlanCode,
  Role,
  RunState,
  StepStatus,
  WorkflowStage,
} from "./domain.js";

export const uuidSchema = z.string().uuid();
export const timestampSchema = z.string().datetime({ offset: true });

function zodEnum<T extends string>(values: readonly T[]): z.ZodType<T> {
  return z.enum(values as [string, ...string[]]);
}

export const paginationSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    items: z.array(item),
    total: z.number().int(),
    page: z.number().int(),
    pageSize: z.number().int(),
  });

export const userSchema = z.object({
  id: uuidSchema,
  email: z.string().email(),
  name: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema.optional(),
});

export const membershipSchema = z.object({
  id: uuidSchema,
  organizationId: uuidSchema,
  userId: uuidSchema,
  role: zodEnum(Object.values(Role)),
  createdAt: timestampSchema,
});

export const organizationSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1),
  slug: z.string(),
  planCode: zodEnum(Object.values(PlanCode)),
  memberCount: z.number().int().default(1),
  createdAt: timestampSchema,
});

export const channelSchema = z.object({
  id: uuidSchema,
  title: z.string(),
  handle: z.string().nullable().optional(),
  kind: z.enum(["youtube"]).default("youtube"),
  status: z.enum(["connected", "pending", "revoked", "mock"]).default("mock"),
  thumbnailUrl: z.string().nullable().optional(),
});

export const projectSchema = z.object({
  id: uuidSchema,
  orgId: uuidSchema,
  name: z.string(),
  topic: z.string(),
  niche: z.string().nullable().optional(),
  tone: z.string().default("documentary"),
  artStyle: z.string().default("2d flat"),
  durationSeconds: z.number().int().positive().default(420),
  narrationLanguage: z.string().default("en-US"),
  voiceType: z.string().default("documentary-male"),
  automationMode: zodEnum(Object.values(AutomationMode)),
  channelId: uuidSchema.nullable().optional(),
  status: z.enum(["draft", "in_progress", "completed", "archived"]).default("draft"),
  coverUrl: z.string().nullable().optional(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema.optional(),
});

export const jobSchema = z.object({
  id: uuidSchema,
  kind: z.string(),
  status: zodEnum(Object.values(JobStatus)),
  progress: z.number().min(0).max(100).default(0),
  error: z.string().nullable().optional(),
  startedAt: timestampSchema.nullable().optional(),
  finishedAt: timestampSchema.nullable().optional(),
});

export const workflowStageSchema = z.object({
  stage: zodEnum(Object.values(WorkflowStage)),
  status: zodEnum(Object.values(StepStatus)),
  startedAt: timestampSchema.nullable().optional(),
  finishedAt: timestampSchema.nullable().optional(),
  provider: z.string().nullable().optional(),
  error: z.string().nullable().optional(),
});

export const runSchema = z.object({
  id: uuidSchema,
  projectId: uuidSchema,
  definitionsVersion: z.string(),
  state: zodEnum(Object.values(RunStatus)),
  currentStage: zodEnum(Object.values(WorkflowStage)).nullable().optional(),
  stages: z.array(workflowStageSchema),
  jobs: z.array(jobSchema),
  totalCostUsd: z.number().default(0),
  startedAt: timestampSchema,
  finishedAt: timestampSchema.nullable().optional(),
});

export const approvalSchema = z.object({
  id: uuidSchema,
  projectId: uuidSchema,
  runId: uuidSchema.nullable().optional(),
  stage: zodEnum(Object.values(WorkflowStage)),
  kind: zodEnum(Object.values(ApprovalKind)),
  state: zodEnum(Object.values(ApprovalState)),
  requestedBy: uuidSchema,
  decidedBy: uuidSchema.nullable().optional(),
  comment: z.string().nullable().optional(),
  reason: z.string().nullable().optional(),
  autoApproved: z.boolean().default(false),
  createdAt: timestampSchema,
  decidedAt: timestampSchema.nullable().optional(),
});

export const costBreakdownSchema = z.object({
  byCategory: z.record(z.number()),
  byProvider: z.record(z.number()),
  total: z.number(),
});

export type User = z.infer<typeof userSchema>;
export type Organization = z.infer<typeof organizationSchema>;
export type Membership = z.infer<typeof membershipSchema>;
export type Channel = z.infer<typeof channelSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Job = z.infer<typeof jobSchema>;
export type WorkflowStageState = z.infer<typeof workflowStageSchema>;
export type Run = z.infer<typeof runSchema>;
export type Approval = z.infer<typeof approvalSchema>;
export type CostBreakdown = z.infer<typeof costBreakdownSchema>;
export type Paginated<T> = z.infer<ReturnType<typeof paginationSchema<T>>>;