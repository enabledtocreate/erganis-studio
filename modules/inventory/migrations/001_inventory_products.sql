CREATE SCHEMA IF NOT EXISTS inventory;

CREATE TABLE IF NOT EXISTS inventory.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id TEXT NOT NULL UNIQUE,
  org_id UUID NOT NULL,
  name TEXT NOT NULL,
  sku TEXT,
  manufacturer TEXT,
  description TEXT,
  unit_price_cents INTEGER,
  created_by_public_id TEXT NOT NULL,
  updated_by_public_id TEXT NOT NULL,
  operation_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  archived_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_inventory_products_org
  ON inventory.products (org_id)
  WHERE archived_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_inventory_products_org_sku
  ON inventory.products (org_id, sku)
  WHERE archived_at IS NULL AND sku IS NOT NULL;
