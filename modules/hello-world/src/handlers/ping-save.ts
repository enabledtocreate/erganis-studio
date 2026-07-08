import {
  BaseRepository,
  DbUnitOfWork,
  OperationContext,
  StepHandler,
  StepHandlerResult,
  createPublicId,
} from '@erganis/platform';

class GreetingRepository extends BaseRepository {
  async insertGreeting(input: {
    orgId: string;
    message: string;
    createdByPublicId: string;
    operationId: string;
    publicId: string;
  }): Promise<{ publicId: string }> {
    await this.execute(
      `INSERT INTO hello_world.greetings
         (public_id, org_id, message, created_by_public_id, operation_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        input.publicId,
        input.orgId,
        input.message,
        input.createdByPublicId,
        input.operationId,
      ],
    );
    return { publicId: input.publicId };
  }
}

export const pingSave: StepHandler = async (
  context: OperationContext,
  unitOfWork: DbUnitOfWork,
  payload: Record<string, unknown>,
): Promise<StepHandlerResult> => {
  const message = String(payload.message ?? 'hello from stub');
  const repo = new GreetingRepository(unitOfWork.client);
  const publicId = createPublicId('greeting');
  const saved = await repo.insertGreeting({
    orgId: context.orgId,
    message,
    createdByPublicId: context.userPublicId,
    operationId: context.operationId,
    publicId,
  });
  return {
    message: 'Greeting saved',
    data: { greetingPublicId: saved.publicId, message },
  };
};

export { pingSave as default };
