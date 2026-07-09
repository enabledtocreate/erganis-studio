import { BaseRepository } from '@erganis/platform';

export interface RoomRecord {
  publicId: string;
  projectPublicId: string;
  name: string;
  sortOrder: number;
  updatedAt: string;
}

export interface UpsertRoomInput {
  orgId: string;
  publicId: string;
  projectPublicId: string;
  name: string;
  sortOrder?: number;
  actorPublicId: string;
  operationId: string;
}

export class RoomRepository extends BaseRepository {
  async listByProject(orgId: string, projectPublicId: string): Promise<RoomRecord[]> {
    return this.queryMany(
      `SELECT public_id, project_public_id, name, sort_order, updated_at
       FROM projects.rooms
       WHERE org_id = $1 AND project_public_id = $2 AND archived_at IS NULL
       ORDER BY sort_order ASC, name ASC`,
      [orgId, projectPublicId],
      mapRoomRow,
    );
  }

  async insert(input: UpsertRoomInput): Promise<RoomRecord> {
    const row = await this.queryOne(
      `INSERT INTO projects.rooms
         (public_id, org_id, project_public_id, name, sort_order,
          created_by_public_id, updated_by_public_id, operation_id)
       VALUES ($1, $2, $3, $4, $5, $6, $6, $7)
       RETURNING public_id, project_public_id, name, sort_order, updated_at`,
      [
        input.publicId,
        input.orgId,
        input.projectPublicId,
        input.name,
        input.sortOrder ?? 0,
        input.actorPublicId,
        input.operationId,
      ],
      mapRoomRow,
    );
    if (!row) {
      throw new Error('Failed to insert room');
    }
    return row;
  }

  async update(input: UpsertRoomInput): Promise<RoomRecord | null> {
    return this.queryOne(
      `UPDATE projects.rooms
       SET name = $4, sort_order = $5,
           updated_by_public_id = $6, operation_id = $7, updated_at = now()
       WHERE org_id = $1 AND public_id = $2 AND project_public_id = $3
         AND archived_at IS NULL
       RETURNING public_id, project_public_id, name, sort_order, updated_at`,
      [
        input.orgId,
        input.publicId,
        input.projectPublicId,
        input.name,
        input.sortOrder ?? 0,
        input.actorPublicId,
        input.operationId,
      ],
      mapRoomRow,
    );
  }
}

function mapRoomRow(row: Record<string, unknown>): RoomRecord {
  return {
    publicId: String(row.public_id),
    projectPublicId: String(row.project_public_id),
    name: String(row.name),
    sortOrder: Number(row.sort_order),
    updatedAt: String(row.updated_at),
  };
}
