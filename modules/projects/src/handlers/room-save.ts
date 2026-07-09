import {
  createPublicId,
  DbUnitOfWork,
  isValidPublicId,
  OperationContext,
  StepHandler,
  StepHandlerResult,
} from '@erganis/platform';
import { ProjectRepository } from '../project.repository';
import { RoomRepository } from '../room.repository';

export const saveRoom: StepHandler = async (
  context: OperationContext,
  unitOfWork: DbUnitOfWork,
  payload: Record<string, unknown>,
): Promise<StepHandlerResult> => {
  const projectPublicId = String(payload.projectPublicId ?? '').trim();
  if (!projectPublicId || !isValidPublicId(projectPublicId)) {
    throw new Error('Valid projectPublicId is required');
  }

  const name = String(payload.name ?? '').trim();
  if (!name) {
    throw new Error('Room name is required');
  }

  const projectRepo = new ProjectRepository(unitOfWork.client);
  const project = await projectRepo.findByPublicId(context.orgId, projectPublicId);
  if (!project) {
    throw new Error(`Project ${projectPublicId} not found`);
  }

  const repo = new RoomRepository(unitOfWork.client);
  const existingPublicId = payload.publicId ? String(payload.publicId) : undefined;
  const publicId =
    existingPublicId && isValidPublicId(existingPublicId)
      ? existingPublicId
      : createPublicId('room');

  const sortOrderRaw = payload.sortOrder ?? payload.sort_order;
  const sortOrder =
    sortOrderRaw === undefined || sortOrderRaw === null || sortOrderRaw === ''
      ? 0
      : Number(sortOrderRaw);

  const input = {
    orgId: context.orgId,
    publicId,
    projectPublicId,
    name,
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    actorPublicId: context.userPublicId,
    operationId: context.operationId,
  };

  const room =
    existingPublicId && isValidPublicId(existingPublicId)
      ? await repo.update(input)
      : await repo.insert(input);

  if (!room) {
    throw new Error(`Room ${publicId} not found`);
  }

  return {
    message: existingPublicId ? 'Room updated' : 'Room created',
    data: { room },
  };
};
