import {
  DbUnitOfWork,
  OperationContext,
  StepHandler,
  StepHandlerResult,
} from '@erganis/platform';
import { ProductRepository } from '../product.repository';

export const loadProducts: StepHandler = async (
  context: OperationContext,
  unitOfWork: DbUnitOfWork,
): Promise<StepHandlerResult> => {
  const repo = new ProductRepository(unitOfWork.client);
  const products = await repo.listActive(context.orgId);
  return {
    message: 'Products loaded',
    data: { products },
  };
};
