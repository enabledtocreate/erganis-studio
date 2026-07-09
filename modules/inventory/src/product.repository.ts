import { BaseRepository } from '@erganis/platform';

export interface ProductRecord {
  publicId: string;
  name: string;
  sku: string | null;
  manufacturer: string | null;
  description: string | null;
  unitPriceCents: number | null;
  updatedAt: string;
}

export interface UpsertProductInput {
  orgId: string;
  publicId: string;
  name: string;
  sku?: string | null;
  manufacturer?: string | null;
  description?: string | null;
  unitPriceCents?: number | null;
  actorPublicId: string;
  operationId: string;
}

export class ProductRepository extends BaseRepository {
  async listActive(orgId: string): Promise<ProductRecord[]> {
    return this.queryMany(
      `SELECT public_id, name, sku, manufacturer, description, unit_price_cents, updated_at
       FROM inventory.products
       WHERE org_id = $1 AND archived_at IS NULL
       ORDER BY name ASC`,
      [orgId],
      (row) => ({
        publicId: String(row.public_id),
        name: String(row.name),
        sku: row.sku ? String(row.sku) : null,
        manufacturer: row.manufacturer ? String(row.manufacturer) : null,
        description: row.description ? String(row.description) : null,
        unitPriceCents:
          row.unit_price_cents === null || row.unit_price_cents === undefined
            ? null
            : Number(row.unit_price_cents),
        updatedAt: String(row.updated_at),
      }),
    );
  }

  async insert(input: UpsertProductInput): Promise<ProductRecord> {
    const row = await this.queryOne(
      `INSERT INTO inventory.products
         (public_id, org_id, name, sku, manufacturer, description, unit_price_cents,
          created_by_public_id, updated_by_public_id, operation_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8, $9)
       RETURNING public_id, name, sku, manufacturer, description, unit_price_cents, updated_at`,
      [
        input.publicId,
        input.orgId,
        input.name,
        input.sku ?? null,
        input.manufacturer ?? null,
        input.description ?? null,
        input.unitPriceCents ?? null,
        input.actorPublicId,
        input.operationId,
      ],
      mapProductRow,
    );
    if (!row) {
      throw new Error('Failed to insert product');
    }
    return row;
  }

  async update(input: UpsertProductInput): Promise<ProductRecord | null> {
    return this.queryOne(
      `UPDATE inventory.products
       SET name = $3, sku = $4, manufacturer = $5, description = $6,
           unit_price_cents = $7, updated_by_public_id = $8, operation_id = $9,
           updated_at = now()
       WHERE org_id = $1 AND public_id = $2 AND archived_at IS NULL
       RETURNING public_id, name, sku, manufacturer, description, unit_price_cents, updated_at`,
      [
        input.orgId,
        input.publicId,
        input.name,
        input.sku ?? null,
        input.manufacturer ?? null,
        input.description ?? null,
        input.unitPriceCents ?? null,
        input.actorPublicId,
        input.operationId,
      ],
      mapProductRow,
    );
  }
}

function mapProductRow(row: Record<string, unknown>): ProductRecord {
  return {
    publicId: String(row.public_id),
    name: String(row.name),
    sku: row.sku ? String(row.sku) : null,
    manufacturer: row.manufacturer ? String(row.manufacturer) : null,
    description: row.description ? String(row.description) : null,
    unitPriceCents:
      row.unit_price_cents === null || row.unit_price_cents === undefined
        ? null
        : Number(row.unit_price_cents),
    updatedAt: String(row.updated_at),
  };
}
