import { saveProduct } from './product-save';

describe('saveProduct', () => {
  const queries: Array<{ sql: string; params?: unknown[] }> = [];
  const unitOfWork = {
    client: {
      query: async (sql: string, params?: unknown[]) => {
        queries.push({ sql, params });
        if (sql.includes('INSERT INTO inventory.products')) {
          return {
            rows: [
              {
                public_id: params?.[0],
                name: params?.[2],
                sku: params?.[3],
                manufacturer: params?.[4],
                description: params?.[5],
                unit_price_cents: params?.[6],
                updated_at: '2026-01-01T00:00:00.000Z',
              },
            ],
            rowCount: 1,
          };
        }
        return { rows: [], rowCount: 0 };
      },
    },
    commit: async () => undefined,
    rollback: async () => undefined,
  };

  const context = {
    operationId: 'op_test',
    orgId: 'org-uuid',
    orgPublicId: 'org_1',
    orgSlug: 'demo',
    userId: 'user-uuid',
    userPublicId: 'user_1',
    surfaceId: 'inventory',
    action: 'save' as const,
    initiatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    queries.length = 0;
  });

  it('creates a product with generated public id', async () => {
    const result = await saveProduct(
      context,
      unitOfWork,
      { name: 'Brass knob', sku: 'HW-1', unitPriceCents: 1299 },
    );
    expect(result.data?.product).toMatchObject({
      name: 'Brass knob',
      sku: 'HW-1',
      unitPriceCents: 1299,
    });
    const product = result.data?.product as { publicId: string };
    expect(String(product.publicId)).toMatch(/^product_/);
    expect(queries[0].sql).toContain('INSERT INTO inventory.products');
  });

  it('rejects missing name', async () => {
    await expect(saveProduct(context, unitOfWork, { name: '  ' })).rejects.toThrow(
      'Product name is required',
    );
  });
});
