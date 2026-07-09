import { CoreApiClient } from '@erganis/studio-shared';
import { cookies } from 'next/headers';
import { config } from './config';

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

export async function loadAdminOrganization() {
  const client = serverClient();
  return client.getAdminOrganization(config.defaultOrgSlug);
}

export async function loadAdminUsers() {
  const client = serverClient();
  return client.getAdminUsers(config.defaultOrgSlug);
}

export async function loadAdminRoles() {
  const client = serverClient();
  return client.getAdminRoles(config.defaultOrgSlug);
}

export async function loadAdminModules() {
  const client = serverClient();
  return client.getAdminModules(config.defaultOrgSlug);
}
