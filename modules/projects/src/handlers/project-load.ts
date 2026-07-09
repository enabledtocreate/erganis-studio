import {
  DbUnitOfWork,
  OperationContext,
  StepHandler,
  StepHandlerResult,
} from '@erganis/platform';
import { AssignmentRepository } from '../assignment.repository';
import { ProjectRepository } from '../project.repository';
import { RoomRepository } from '../room.repository';

export const loadProjects: StepHandler = async (
  context: OperationContext,
  unitOfWork: DbUnitOfWork,
  payload: Record<string, unknown>,
): Promise<StepHandlerResult> => {
  const projectRepo = new ProjectRepository(unitOfWork.client);
  const roomRepo = new RoomRepository(unitOfWork.client);
  const assignmentRepo = new AssignmentRepository(unitOfWork.client);

  const projectPublicId = payload.projectPublicId
    ? String(payload.projectPublicId)
    : undefined;

  if (projectPublicId) {
    const project = await projectRepo.findByPublicId(context.orgId, projectPublicId);
    if (!project) {
      throw new Error(`Project ${projectPublicId} not found`);
    }
    const rooms = await roomRepo.listByProject(context.orgId, projectPublicId);
    const assignments = await assignmentRepo.listByProject(context.orgId, projectPublicId);
    return {
      message: 'Project detail loaded',
      data: { project, rooms, assignments },
    };
  }

  const projects = await projectRepo.listActive(context.orgId);
  return {
    message: 'Projects loaded',
    data: { projects },
  };
};
