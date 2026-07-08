CREATE SCHEMA IF NOT EXISTS hello_world;

CREATE TABLE IF NOT EXISTS hello_world.greetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id TEXT NOT NULL UNIQUE,
  org_id UUID NOT NULL,
  message TEXT NOT NULL,
  created_by_public_id TEXT NOT NULL,
  operation_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_greetings_org_id ON hello_world.greetings (org_id);
