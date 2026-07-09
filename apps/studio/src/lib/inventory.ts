import { CoreApiClient, InventoryProduct, SurfaceLoadResult } from '@erganis/studio-shared';
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

export async function loadInventoryProducts(): Promise<InventoryProduct[]> {
  const client = serverClient();
  const surface = await client.loadSurface(config.defaultOrgSlug, 'inventory');
  return extractProducts(surface);
}

export function extractProducts(surface: SurfaceLoadResult): InventoryProduct[] {
  const step = surface.modules['erganis.inventory']?.['inventory-list'];
  const products = step?.data?.products;
  if (!Array.isArray(products)) {
    return [];
  }
  return products as InventoryProduct[];
}
