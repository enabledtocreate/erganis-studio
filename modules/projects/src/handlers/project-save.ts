import {
  createPublicId,
  DbUnitOfWork,
  isValidPublicId,
  OperationContext,
  StepHandler,
  StepHandlerResult,
} from '@erganis/platform';
import { ProjectRepository, ProjectStatus } from '../project.repository';

const VALID_STATUSES: ProjectStatus[] = ['active', 'on_hold', 'completed', 'archived'];

function readOptionalString(payload: Record<string, unknown>, key: string): string | null {
  const value = payload[key];
  if (value === undefined || value === null || value === '') {
    return null;
  }
  return String(value);
}

function readStatus(payload: Record<string, unknown>): ProjectStatus {
  const raw = payload.status ? String(payload.status) : 'active';
  if (!VALID_STATUSES.includes(raw as ProjectStatus)) {
    throw new Error(`Invalid project status: ${raw}`);
  }
  return raw as ProjectStatus;
}

export const saveProject: StepHandler = async (
  context: OperationContext,
  unitOfWork: DbUnitOfWork,
  payload: Record<string, unknown>,
): Promise<StepHandlerResult> => {
  const name = String(payload.name ?? '').trim();
  if (!name) {
    throw new Error('Project name is required');
  }

  const repo = new ProjectRepository(unitOfWork.client);
  const existingPublicId = payload.publicId ? String(payload.publicId) : undefined;
  const publicId =
    existingPublicId && isValidPublicId(existingPublicId)
      ? existingPublicId
      : createPublicId('project');

  const input = {
    orgId: context.orgId,
    publicId,
    name,
    phase: readOptionalString(payload, 'phase'),
    status: readStatus(payload),
    actorPublicId: context.userPublicId,
    operationId: context.operationId,
  };

  const project =
    existingPublicId && isValidPublicId(existingPublicId)
      ? await repo.update(input)
      : await repo.insert(input);

  if (!project) {
    throw new Error(`Project ${publicId} not found`);
  }

  return {
    message: existingPublicId ? 'Project updated' : 'Project created',
    data: { project },
  };
};
