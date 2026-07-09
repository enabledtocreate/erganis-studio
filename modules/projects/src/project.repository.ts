import { BaseRepository } from '@erganis/platform';

export type ProjectStatus = 'active' | 'on_hold' | 'completed' | 'archived';

export interface ProjectRecord {
  publicId: string;
  name: string;
  phase: string | null;
  status: ProjectStatus;
  updatedAt: string;
}

export interface UpsertProjectInput {
  orgId: string;
  publicId: string;
  name: string;
  phase?: string | null;
  status?: ProjectStatus;
  actorPublicId: string;
  operationId: string;
}

export class ProjectRepository extends BaseRepository {
  async listActive(orgId: string): Promise<ProjectRecord[]> {
    return this.queryMany(
      `SELECT public_id, name, phase, status, updated_at
       FROM projects.projects
       WHERE org_id = $1 AND archived_at IS NULL
       ORDER BY name ASC`,
      [orgId],
      mapProjectRow,
    );
  }

  async findByPublicId(orgId: string, publicId: string): Promise<ProjectRecord | null> {
    return this.queryOne(
      `SELECT public_id, name, phase, status, updated_at
       FROM projects.projects
       WHERE org_id = $1 AND public_id = $2 AND archived_at IS NULL`,
      [orgId, publicId],
      mapProjectRow,
    );
  }

  async insert(input: UpsertProjectInput): Promise<ProjectRecord> {
    const row = await this.queryOne(
      `INSERT INTO projects.projects
         (public_id, org_id, name, phase, status,
          created_by_public_id, updated_by_public_id, operation_id)
       VALUES ($1, $2, $3, $4, $5, $6, $6, $7)
       RETURNING public_id, name, phase, status, updated_at`,
      [
        input.publicId,
        input.orgId,
        input.name,
        input.phase ?? null,
        input.status ?? 'active',
        input.actorPublicId,
        input.operationId,
      ],
      mapProjectRow,
    );
    if (!row) {
      throw new Error('Failed to insert project');
    }
    return row;
  }

  async update(input: UpsertProjectInput): Promise<ProjectRecord | null> {
    return this.queryOne(
      `UPDATE projects.projects
       SET name = $3, phase = $4, status = $5,
           updated_by_public_id = $6, operation_id = $7, updated_at = now()
       WHERE org_id = $1 AND public_id = $2 AND archived_at IS NULL
       RETURNING public_id, name, phase, status, updated_at`,
      [
        input.orgId,
        input.publicId,
        input.name,
        input.phase ?? null,
        input.status ?? 'active',
        input.actorPublicId,
        input.operationId,
      ],
      mapProjectRow,
    );
  }
}

function mapProjectRow(row: Record<string, unknown>): ProjectRecord {
  return {
    publicId: String(row.public_id),
    name: String(row.name),
    phase: row.phase ? String(row.phase) : null,
    status: String(row.status) as ProjectStatus,
    updatedAt: String(row.updated_at),
  };
}
