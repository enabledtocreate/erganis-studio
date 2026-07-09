export interface StudioConfig {
  coreApiUrl: string;
  defaultOrgSlug: string;
}

export function resolveStudioConfig(env: Record<string, string | undefined> = {}): StudioConfig {
  return {
    coreApiUrl: env.NEXT_PUBLIC_CORE_API_URL ?? env.CORE_API_URL ?? 'http://localhost:5000',
    // Local Core seed (e2e / dev) uses `acme`; override via NEXT_PUBLIC_DEFAULT_ORG_SLUG.
    defaultOrgSlug: env.NEXT_PUBLIC_DEFAULT_ORG_SLUG ?? 'acme',
  };
}

function readApiError(body: unknown, fallback: string): string {
  if (typeof body !== 'object' || body === null) {
    return fallback;
  }
  const record = body as Record<string, unknown>;
  if (typeof record.message === 'string') {
    return record.message;
  }
  if (typeof record.error === 'object' && record.error !== null) {
    const error = record.error as Record<string, unknown>;
    if (typeof error.message === 'string') {
      return error.message;
    }
  }
  return fallback;
}

export interface AuthUserView {
  publicId: string;
  email: string;
  displayName: string | null;
}

export interface AuthOrgView {
  publicId: string;
  slug: string;
  name: string;
  authMode: string;
}

export interface AuthRoleView {
  name: string;
  permissions: string[];
  isAdmin: boolean;
}

export interface SessionUserView {
  user: AuthUserView;
  org: AuthOrgView;
  role: AuthRoleView;
}

export interface OperationExecuteResult {
  outcome: string;
  operationId: string;
  surfaceId: string;
  action: string;
  steps: Array<{ stepId: string; handler: string; result?: { data?: Record<string, unknown> } }>;
}

export interface SurfaceLoadResult {
  surfaceId: string;
  orgSlug: string;
  modules: Record<string, Record<string, { data?: Record<string, unknown> }>>;
}

export interface InventoryProduct {
  publicId: string;
  name: string;
  sku: string | null;
  manufacturer: string | null;
  description: string | null;
  unitPriceCents: number | null;
  updatedAt: string;
}

export interface ProjectRecord {
  publicId: string;
  name: string;
  phase: string | null;
  status: string;
  updatedAt: string;
}

export interface RoomRecord {
  publicId: string;
  projectPublicId: string;
  name: string;
  sortOrder: number;
  updatedAt: string;
}

export interface AssignmentRecord {
  publicId: string;
  projectPublicId: string;
  roomPublicId: string | null;
  productPublicId: string;
  productName: string;
  productSku: string | null;
  quantity: number;
  notes: string | null;
  updatedAt: string;
}

export interface AdminOrganizationView {
  publicId: string;
  slug: string;
  name: string;
  allowedDomains: string[];
  authMode: string;
}

export interface AdminUserView {
  userPublicId: string;
  email: string;
  displayName: string | null;
  roleName: string;
  isAdmin: boolean;
  joinedAt: string;
}

export interface AdminRoleView {
  name: string;
  permissions: string[];
  isAdmin: boolean;
}

export interface AdminModuleOperationView {
  surfaceId: string;
  action: string;
  stepId: string;
  handler: string;
  phase: string;
}

export interface AdminModuleView {
  moduleId: string;
  name: string;
  version: string;
  description: string | null;
  shipByDefault: boolean;
  enabled: boolean;
  operations: AdminModuleOperationView[];
}

export interface AdminModulesResponse {
  modules: AdminModuleView[];
  moduleRegistryUrl: string;
  moduleRegistryNote: string;
}

export interface DeveloperLinkType {
  id: string;
  name: string;
  fromModule: string;
  fromEntity: string;
  fromField: string;
  toModule: string;
  toEntity: string;
  toField: string;
  linkKind: string;
  via: string | null;
  description: string;
}

export interface DeveloperEntitySample {
  publicId: string;
  label: string;
  moduleId: string;
  entity: string;
  extra?: Record<string, string | null>;
}

export interface DeveloperLiveLink {
  linkTypeId: string;
  fromPublicId: string;
  fromLabel: string;
  toPublicId: string;
  toLabel: string;
  contextPublicId?: string | null;
  contextLabel?: string | null;
}

export interface DeveloperGraphData {
  generatedAt: string;
  orgSlug: string;
  modules: Array<{
    moduleId: string;
    name: string;
    version: string;
    description: string | null;
    shipByDefault: boolean;
    operations: Array<{ surfaceId: string; action: string; stepId: string; handler: string }>;
    surfaces: string[];
  }>;
  linkTypes: DeveloperLinkType[];
  entities: DeveloperEntitySample[];
  liveLinks: DeveloperLiveLink[];
  pipeline: Array<{
    moduleId: string;
    surfaceId: string;
    action: string;
    stepId: string;
    handler: string;
    envelope: string;
  }>;
  contracts: Array<{ id: string; path: string; endpoint: string }>;
}

export interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

export class CoreApiClient {
  private readonly fetchImpl: typeof fetch;

  constructor(
    private readonly baseUrl: string,
    fetchImpl?: typeof fetch,
  ) {
    // Detached `fetch` throws "Illegal invocation" in browsers — always wrap the call.
    this.fetchImpl =
      fetchImpl ??
      ((input: RequestInfo | URL, init?: RequestInit) => fetch(input, init));
  }

  async getHealth(): Promise<HealthResponse> {
    const res = await this.fetchImpl(`${this.baseUrl}/health`);
    if (!res.ok) {
      throw new Error(`Core health check failed: ${res.status}`);
    }
    return res.json() as Promise<HealthResponse>;
  }

  async loginLocal(orgSlug: string, email: string, password: string): Promise<SessionUserView> {
    const res = await this.fetchImpl(`${this.baseUrl}/auth/local/${orgSlug}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(readApiError(body, `Login failed (${res.status})`));
    }
    return res.json() as Promise<SessionUserView>;
  }

  async getSession(orgSlug: string): Promise<SessionUserView | null> {
    const res = await this.fetchImpl(`${this.baseUrl}/auth/me/${orgSlug}`, {
      credentials: 'include',
    });
    if (res.status === 401) {
      return null;
    }
    if (!res.ok) {
      throw new Error(`Session check failed (${res.status})`);
    }
    return res.json() as Promise<SessionUserView>;
  }

  async logout(): Promise<void> {
    await this.fetchImpl(`${this.baseUrl}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  }

  async loadSurface(
    orgSlug: string,
    surfaceId: string,
    params: Record<string, string> = {},
  ): Promise<SurfaceLoadResult> {
    const search = new URLSearchParams({ orgSlug, ...params });
    const res = await this.fetchImpl(
      `${this.baseUrl}/surfaces/${encodeURIComponent(surfaceId)}/load?${search.toString()}`,
      { credentials: 'include', cache: 'no-store' },
    );
    if (!res.ok) {
      throw new Error(`Surface load failed (${res.status})`);
    }
    return res.json() as Promise<SurfaceLoadResult>;
  }

  async getAdminOrganization(orgSlug: string): Promise<AdminOrganizationView> {
    const res = await this.fetchImpl(`${this.baseUrl}/admin/${orgSlug}/organization`, {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error(readApiError(await res.json().catch(() => ({})), `Admin org load failed (${res.status})`));
    }
    return res.json() as Promise<AdminOrganizationView>;
  }

  async getAdminUsers(orgSlug: string): Promise<AdminUserView[]> {
    const res = await this.fetchImpl(`${this.baseUrl}/admin/${orgSlug}/users`, {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error(readApiError(await res.json().catch(() => ({})), `Admin users load failed (${res.status})`));
    }
    const body = (await res.json()) as { users: AdminUserView[] };
    return body.users;
  }

  async getAdminRoles(orgSlug: string): Promise<AdminRoleView[]> {
    const res = await this.fetchImpl(`${this.baseUrl}/admin/${orgSlug}/roles`, {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error(readApiError(await res.json().catch(() => ({})), `Admin roles load failed (${res.status})`));
    }
    const body = (await res.json()) as { roles: AdminRoleView[] };
    return body.roles;
  }

  async getAdminModules(orgSlug: string): Promise<AdminModulesResponse> {
    const res = await this.fetchImpl(`${this.baseUrl}/admin/${orgSlug}/modules`, {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error(readApiError(await res.json().catch(() => ({})), `Admin modules load failed (${res.status})`));
    }
    return res.json() as Promise<AdminModulesResponse>;
  }

  async setAdminModuleEnabled(
    orgSlug: string,
    moduleId: string,
    enabled: boolean,
  ): Promise<{ ok: boolean; moduleId: string; enabled: boolean }> {
    const res = await this.fetchImpl(`${this.baseUrl}/admin/${orgSlug}/modules/${encodeURIComponent(moduleId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ enabled }),
    });
    if (!res.ok) {
      throw new Error(readApiError(await res.json().catch(() => ({})), `Module toggle failed (${res.status})`));
    }
    return res.json() as Promise<{ ok: boolean; moduleId: string; enabled: boolean }>;
  }

  async getCompositionSchemas(): Promise<{
    schemas: Array<{ id: string; path: string; description: string; schema: unknown }>;
  }> {
    const res = await this.fetchImpl(`${this.baseUrl}/composition/schemas`, {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error(`Composition schemas failed (${res.status})`);
    }
    return res.json() as Promise<{
      schemas: Array<{ id: string; path: string; description: string; schema: unknown }>;
    }>;
  }

  async executeOperation(input: {
    orgSlug: string;
    surfaceId: string;
    action: string;
    payload?: Record<string, unknown>;
  }): Promise<OperationExecuteResult> {
    const res = await this.fetchImpl(`${this.baseUrl}/operations/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        orgSlug: input.orgSlug,
        surfaceId: input.surfaceId,
        action: input.action,
        payload: input.payload ?? {},
      }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(readApiError(body, `Operation failed (${res.status})`));
    }
    return res.json() as Promise<OperationExecuteResult>;
  }
}
