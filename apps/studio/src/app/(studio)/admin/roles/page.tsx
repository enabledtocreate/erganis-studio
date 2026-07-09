import { AdminSubnav } from '@/components/admin-subnav';
import { Card, CardBody } from '@/components/ui/card';
import { StudioPageHeader } from '@/components/studio-page-header';
import { loadAdminRoles } from '@/lib/admin';

export default async function AdminRolesPage() {
  let roles: Awaited<ReturnType<typeof loadAdminRoles>> = [];
  let loadError: string | null = null;
  try {
    roles = await loadAdminRoles();
  } catch {
    loadError = 'Could not load roles — ensure you are signed in as an org admin.';
  }

  return (
    <>
      <StudioPageHeader
        eyebrow="Admin"
        title="Roles"
        description="Permission roles defined for your organization in Core."
      />
      <AdminSubnav />

      {loadError ? (
        <p className="mb-6 rounded-studio border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {loadError}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {roles.map((role) => (
          <Card key={role.name}>
            <CardBody>
              <div className="flex items-start justify-between gap-3">
                <p className="text-lg font-medium capitalize text-ink-900">{role.name}</p>
                {role.isAdmin ? (
                  <span className="rounded bg-linen-100 px-2 py-0.5 text-xs text-ink-600">
                    Admin
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-ink-500">
                {role.permissions.length > 0
                  ? role.permissions.join(', ')
                  : 'No explicit permissions (inherits org defaults)'}
              </p>
            </CardBody>
          </Card>
        ))}
        {roles.length === 0 && !loadError ? (
          <p className="text-sm text-ink-500">No roles defined.</p>
        ) : null}
      </div>
    </>
  );
}
