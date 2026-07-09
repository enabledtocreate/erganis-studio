CREATE TABLE IF NOT EXISTS projects.item_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id TEXT NOT NULL UNIQUE,
  org_id UUID NOT NULL,
  project_public_id TEXT NOT NULL,
  room_public_id TEXT,
  product_public_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  notes TEXT,
  created_by_public_id TEXT NOT NULL,
  updated_by_public_id TEXT NOT NULL,
  operation_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  archived_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_projects_assignments_project
  ON projects.item_assignments (org_id, project_public_id)
  WHERE archived_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_projects_assignments_room
  ON projects.item_assignments (org_id, room_public_id)
  WHERE archived_at IS NULL AND room_public_id IS NOT NULL;
