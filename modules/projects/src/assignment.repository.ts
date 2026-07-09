import { BaseRepository } from '@erganis/platform';

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

export interface UpsertAssignmentInput {
  orgId: string;
  publicId: string;
  projectPublicId: string;
  roomPublicId?: string | null;
  productPublicId: string;
  quantity?: number;
  notes?: string | null;
  actorPublicId: string;
  operationId: string;
}

export class AssignmentRepository extends BaseRepository {
  async listByProject(orgId: string, projectPublicId: string): Promise<AssignmentRecord[]> {
    return this.queryMany(
      `SELECT a.public_id, a.project_public_id, a.room_public_id, a.product_public_id,
              p.name AS product_name, p.sku AS product_sku,
              a.quantity, a.notes, a.updated_at
       FROM projects.item_assignments a
       LEFT JOIN inventory.products p
         ON p.public_id = a.product_public_id AND p.org_id = a.org_id AND p.archived_at IS NULL
       WHERE a.org_id = $1 AND a.project_public_id = $2 AND a.archived_at IS NULL
       ORDER BY a.room_public_id NULLS FIRST, p.name ASC`,
      [orgId, projectPublicId],
      mapAssignmentRow,
    );
  }

  async insert(input: UpsertAssignmentInput): Promise<AssignmentRecord> {
    const row = await this.queryOne(
      `INSERT INTO projects.item_assignments
         (public_id, org_id, project_public_id, room_public_id, product_public_id,
          quantity, notes, created_by_public_id, updated_by_public_id, operation_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8, $9)
       RETURNING public_id, project_public_id, room_public_id, product_public_id,
                 quantity, notes, updated_at`,
      [
        input.publicId,
        input.orgId,
        input.projectPublicId,
        input.roomPublicId ?? null,
        input.productPublicId,
        input.quantity ?? 1,
        input.notes ?? null,
        input.actorPublicId,
        input.operationId,
      ],
      mapAssignmentRowBase,
    );
    if (!row) {
      throw new Error('Failed to insert assignment');
    }
    return this.enrichProduct(input.orgId, row);
  }

  async update(input: UpsertAssignmentInput): Promise<AssignmentRecord | null> {
    const row = await this.queryOne(
      `UPDATE projects.item_assignments
       SET room_public_id = $4, product_public_id = $5, quantity = $6, notes = $7,
           updated_by_public_id = $8, operation_id = $9, updated_at = now()
       WHERE org_id = $1 AND public_id = $2 AND project_public_id = $3
         AND archived_at IS NULL
       RETURNING public_id, project_public_id, room_public_id, product_public_id,
                 quantity, notes, updated_at`,
      [
        input.orgId,
        input.publicId,
        input.projectPublicId,
        input.roomPublicId ?? null,
        input.productPublicId,
        input.quantity ?? 1,
        input.notes ?? null,
        input.actorPublicId,
        input.operationId,
      ],
      mapAssignmentRowBase,
    );
    if (!row) {
      return null;
    }
    return this.enrichProduct(input.orgId, row);
  }

  async archive(orgId: string, publicId: string, actorPublicId: string, operationId: string): Promise<boolean> {
    const rowCount = await this.execute(
      `UPDATE projects.item_assignments
       SET archived_at = now(), updated_by_public_id = $3, operation_id = $4, updated_at = now()
       WHERE org_id = $1 AND public_id = $2 AND archived_at IS NULL`,
      [orgId, publicId, actorPublicId, operationId],
    );
    return rowCount > 0;
  }

  private async enrichProduct(
    orgId: string,
    row: Omit<AssignmentRecord, 'productName' | 'productSku'>,
  ): Promise<AssignmentRecord> {
    const product = await this.queryOne(
      `SELECT name, sku FROM inventory.products
       WHERE org_id = $1 AND public_id = $2 AND archived_at IS NULL`,
      [orgId, row.productPublicId],
      (r) => ({
        name: String(r.name),
        sku: r.sku ? String(r.sku) : null,
      }),
    );
    return {
      ...row,
      productName: product?.name ?? row.productPublicId,
      productSku: product?.sku ?? null,
    };
  }
}

function mapAssignmentRow(row: Record<string, unknown>): AssignmentRecord {
  return {
    publicId: String(row.public_id),
    projectPublicId: String(row.project_public_id),
    roomPublicId: row.room_public_id ? String(row.room_public_id) : null,
    productPublicId: String(row.product_public_id),
    productName: row.product_name ? String(row.product_name) : String(row.product_public_id),
    productSku: row.product_sku ? String(row.product_sku) : null,
    quantity: Number(row.quantity),
    notes: row.notes ? String(row.notes) : null,
    updatedAt: String(row.updated_at),
  };
}

function mapAssignmentRowBase(row: Record<string, unknown>): Omit<AssignmentRecord, 'productName' | 'productSku'> {
  return {
    publicId: String(row.public_id),
    projectPublicId: String(row.project_public_id),
    roomPublicId: row.room_public_id ? String(row.room_public_id) : null,
    productPublicId: String(row.product_public_id),
    quantity: Number(row.quantity),
    notes: row.notes ? String(row.notes) : null,
    updatedAt: String(row.updated_at),
  };
}
