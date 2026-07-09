import { DeveloperGraphData } from '@erganis/studio-shared';
import { cookies } from 'next/headers';
import { config } from './config';
import { CoreApiClient } from '@erganis/studio-shared';

const DEVELOPER_MODULE_ID = 'erganis.developer';

function serverClient() {
  const cookieStore = cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');
  return new CoreApiClient(config.coreApiUrl, (input, init) =>
    fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      cache: 'no-store',
    }),
  );
}

export async function loadDeveloperGraph(): Promise<DeveloperGraphData | null> {
  const client = serverClient();
  const surface = await client.loadSurface(config.defaultOrgSlug, 'developer');
  const step = surface.modules['erganis.developer']?.['developer-graph'];
  return (step?.data as DeveloperGraphData | undefined) ?? null;
}

export async function isDeveloperModuleEnabled(): Promise<boolean> {
  try {
    const client = serverClient();
    const { modules } = await client.getAdminModules(config.defaultOrgSlug);
    return modules.some((mod) => mod.moduleId === DEVELOPER_MODULE_ID && mod.enabled);
  } catch {
    return false;
  }
}

export async function loadCompositionSchemas() {
  const client = serverClient();
  return client.getCompositionSchemas();
}
