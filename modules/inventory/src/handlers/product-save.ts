import {
  createPublicId,
  DbUnitOfWork,
  isValidPublicId,
  OperationContext,
  StepHandler,
  StepHandlerResult,
} from '@erganis/platform';
import { ProductRepository } from '../product.repository';

function readOptionalString(payload: Record<string, unknown>, key: string): string | null {
  const value = payload[key];
  if (value === undefined || value === null || value === '') {
    return null;
  }
  return String(value);
}

function readPriceCents(payload: Record<string, unknown>): number | null {
  const raw = payload.unitPriceCents ?? payload.unit_price_cents;
  if (raw === undefined || raw === null || raw === '') {
    return null;
  }
  const cents = Number(raw);
  if (!Number.isFinite(cents) || cents < 0) {
    throw new Error('unitPriceCents must be a non-negative number');
  }
  return Math.round(cents);
}

export const saveProduct: StepHandler = async (
  context: OperationContext,
  unitOfWork: DbUnitOfWork,
  payload: Record<string, unknown>,
): Promise<StepHandlerResult> => {
  const name = String(payload.name ?? '').trim();
  if (!name) {
    throw new Error('Product name is required');
  }

  const repo = new ProductRepository(unitOfWork.client);
  const existingPublicId = payload.publicId ? String(payload.publicId) : undefined;
  const publicId =
    existingPublicId && isValidPublicId(existingPublicId)
      ? existingPublicId
      : createPublicId('product');

  const input = {
    orgId: context.orgId,
    publicId,
    name,
    sku: readOptionalString(payload, 'sku'),
    manufacturer: readOptionalString(payload, 'manufacturer'),
    description: readOptionalString(payload, 'description'),
    unitPriceCents: readPriceCents(payload),
    actorPublicId: context.userPublicId,
    operationId: context.operationId,
  };

  const product =
    existingPublicId && isValidPublicId(existingPublicId)
      ? await repo.update(input)
      : await repo.insert(input);

  if (!product) {
    throw new Error(`Product ${publicId} not found`);
  }

  return {
    message: existingPublicId ? 'Product updated' : 'Product created',
    data: { product },
  };
};
