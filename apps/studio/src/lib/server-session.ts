import { CoreApiClient } from '@erganis/studio-shared';
import { cookies } from 'next/headers';
import { config } from './config';

export async function getServerSession() {
  const cookieStore = cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');
  if (!cookieHeader) {
    return null;
  }

  const client = new CoreApiClient(config.coreApiUrl, (input, init) =>
    fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        Cookie: cookieHeader,
      },
      cache: 'no-store',
    }),
  );

  try {
    return await client.getSession(config.defaultOrgSlug);
  } catch {
    return null;
  }
}
