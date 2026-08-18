export interface ClientOptions {
  baseUrl: string;
  /** Bearer token provider — returns null when unauthenticated. */
  getToken?: () => string | null | Promise<string | null>;
  /** Optional active organization id injected as X-Org-Id header. */
  getOrgId?: () => string | null | Promise<string | null>;
  fetchImpl?: typeof fetch;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: unknown,
    message?: string,
  ) {
    super(message ?? `API error ${status}`);
    this.name = "ApiError";
  }
}

export interface RequestOptions {
  method?: string;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  timeoutMs?: number;
}

export class ApiClient {
  private baseUrl: string;
  private getToken?: ClientOptions["getToken"];
  private getOrgId?: ClientOptions["getOrgId"];
  private fetchImpl: typeof fetch;

  constructor(options: ClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.getToken = options.getToken;
    this.getOrgId = options.getOrgId;
    this.fetchImpl = options.fetchImpl ?? ((...args) => fetch(...args));
  }

  private buildUrl(path: string, params?: RequestOptions["params"]): string {
    const url = new URL(`${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
    }
    return url.toString();
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const token = this.getToken ? await this.getToken() : null;
    const orgId = this.getOrgId ? await this.getOrgId() : null;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers,
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    if (orgId) headers["X-Org-Id"] = orgId;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 30000);

    let response: Response;
    try {
      response = await this.fetchImpl(this.buildUrl(path, options.params), {
        method: options.method ?? "GET",
        headers,
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      let detail: unknown = undefined;
      try {
        detail = await response.json();
      } catch {
        detail = await response.text();
      }
      throw new ApiError(response.status, detail);
    }

    const text = await response.text();
    if (!text) return undefined as T;
    try {
      return JSON.parse(text) as T;
    } catch {
      return text as unknown as T;
    }
  }

  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, options);
  }
  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: "POST", body });
  }
  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: "PUT", body });
  }
  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: "PATCH", body });
  }
  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: "DELETE" });
  }
}