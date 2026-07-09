import {
  createPublicId,
  DbUnitOfWork,
  isValidPublicId,
  OperationContext,
  StepHandler,
  StepHandlerResult,
} from '@erganis/platform';
import { AssignmentRepository } from '../assignment.repository';
import { ProjectRepository } from '../project.repository';

function readOptionalString(payload: Record<string, unknown>, key: string): string | null {
  const value = payload[key];
  if (value === undefined || value === null || value === '') {
    return null;
  }
  return String(value);
}

export const saveAssignment: StepHandler = async (
  context: OperationContext,
  unitOfWork: DbUnitOfWork,
  payload: Record<string, unknown>,
): Promise<StepHandlerResult> => {
  const projectPublicId = String(payload.projectPublicId ?? '').trim();
  if (!projectPublicId || !isValidPublicId(projectPublicId)) {
    throw new Error('Valid projectPublicId is required');
  }

  const projectRepo = new ProjectRepository(unitOfWork.client);
  const project = await projectRepo.findByPublicId(context.orgId, projectPublicId);
  if (!project) {
    throw new Error(`Project ${projectPublicId} not found`);
  }

  const repo = new AssignmentRepository(unitOfWork.client);
  const unassign = payload.unassign === true || payload.unassign === 'true';

  const existingPublicId = payload.publicId ? String(payload.publicId) : undefined;
  if (unassign) {
    if (!existingPublicId || !isValidPublicId(existingPublicId)) {
      throw new Error('publicId is required to unassign');
    }
    const removed = await repo.archive(
      context.orgId,
      existingPublicId,
      context.userPublicId,
      context.operationId,
    );
    if (!removed) {
      throw new Error(`Assignment ${existingPublicId} not found`);
    }
    return { message: 'Assignment removed', data: { publicId: existingPublicId } };
  }

  const productPublicId = String(payload.productPublicId ?? '').trim();
  if (!productPublicId || !isValidPublicId(productPublicId)) {
    throw new Error('Valid productPublicId is required');
  }

  const roomPublicIdRaw = readOptionalString(payload, 'roomPublicId');
  if (roomPublicIdRaw && !isValidPublicId(roomPublicIdRaw)) {
    throw new Error('Invalid roomPublicId');
  }

  const quantityRaw = payload.quantity;
  const quantity =
    quantityRaw === undefined || quantityRaw === null || quantityRaw === ''
      ? 1
      : Number(quantityRaw);
  if (!Number.isFinite(quantity) || quantity < 1) {
    throw new Error('quantity must be a positive number');
  }

  const publicId =
    existingPublicId && isValidPublicId(existingPublicId)
      ? existingPublicId
      : createPublicId('assignment');

  const input = {
    orgId: context.orgId,
    publicId,
    projectPublicId,
    roomPublicId: roomPublicIdRaw,
    productPublicId,
    quantity: Math.round(quantity),
    notes: readOptionalString(payload, 'notes'),
    actorPublicId: context.userPublicId,
    operationId: context.operationId,
  };

  const assignment =
    existingPublicId && isValidPublicId(existingPublicId)
      ? await repo.update(input)
      : await repo.insert(input);

  if (!assignment) {
    throw new Error(`Assignment ${publicId} not found`);
  }

  return {
    message: existingPublicId ? 'Assignment updated' : 'Assignment created',
    data: { assignment },
  };
};
