import type {
  Approval,
  Channel,
  Membership,
  Organization,
  Paginated,
  Project,
  Run,
  User,
} from "@docuflow/shared";
import { ApiClient, ApiError, type ClientOptions, type RequestOptions } from "./client.js";

export { ApiClient, ApiError };
export type { ClientOptions, RequestOptions };

export interface Session {
  user: User;
  memberships: Membership[];
  organizations: Organization[];
}

export interface CreateProjectInput {
  name: string;
  topic: string;
  niche?: string;
  tone?: string;
  artStyle?: string;
  durationSeconds?: number;
  narrationLanguage?: string;
  voiceType?: string;
  automationMode?: string;
  channelId?: string;
}

export interface RunResponse extends Run {}

/** Typed client over the DocuFlow REST API. */
export class DocuFlow {
  constructor(private client: ApiClient) {}

  static create(options: ClientOptions): DocuFlow {
    return new DocuFlow(new ApiClient(options));
  }

  auth = {
    me: () => this.client.get<Session>("/api/v1/auth/me"),
  };

  orgs = {
    list: () => this.client.get<Organization[]>("/api/v1/organizations"),
    get: (id: string) => this.client.get<Organization>(`/api/v1/organizations/${id}`),
    create: (body: { name: string; slug?: string }) =>
      this.client.post<Organization>("/api/v1/organizations", body),
    members: (id: string, params?: RequestOptions["params"]) =>
      this.client.get<Paginated<Membership>>(`/api/v1/organizations/${id}/members`, { params }),
    invite: (id: string, body: { email: string; role: string }) =>
      this.client.post(`/api/v1/organizations/${id}/invitations`, body),
  };

  projects = {
    list: (orgId: string, params?: RequestOptions["params"]) =>
      this.client.get<Paginated<Project>>(`/api/v1/orgs/${orgId}/projects`, { params }),
    get: (id: string) => this.client.get<Project>(`/api/v1/projects/${id}`),
    create: (body: CreateProjectInput) => this.client.post<Project>("/api/v1/projects", body),
    update: (id: string, body: Partial<CreateProjectInput>) =>
      this.client.patch<Project>(`/api/v1/projects/${id}`, body),
    runs: (projectId: string) => this.client.get<Run[]>(`/api/v1/projects/${projectId}/runs`),
    startWorkflow: (projectId: string, body?: { definitionId?: string }) =>
      this.client.post<Run>(`/api/v1/projects/${projectId}/runs/start`, body ?? {}),
  };

  approvals = {
    pending: (orgId: string, params?: RequestOptions["params"]) =>
      this.client.get<Paginated<Approval>>(`/api/v1/approvals?orgId=${orgId}`, { params }),
    decide: (id: string, body: { decision: string; comment?: string }) =>
      this.client.post(`/api/v1/approvals/${id}/decide`, body),
  };

  channels = {
    connect: () => this.client.post<{ url: string }>("/api/v1/channels/oauth/authorize"),
    list: () => this.client.get<unknown[]>("/api/v1/channels"),
  };
}

export * from "./client.js";