import { AdminSubnav } from '@/components/admin-subnav';
import { Card, CardBody } from '@/components/ui/card';
import { StudioPageHeader } from '@/components/studio-page-header';
import { loadAdminOrganization } from '@/lib/admin';

export default async function AdminOrganizationPage() {
  let org = null;
  let loadError: string | null = null;
  try {
    org = await loadAdminOrganization();
  } catch {
    loadError = 'Could not load organization — ensure you are signed in as an org admin.';
  }

  return (
    <>
      <StudioPageHeader
        eyebrow="Admin"
        title="Organization"
        description="Firm identity and authentication settings from Core."
      />
      <AdminSubnav />

      {loadError ? (
        <p className="mb-6 rounded-studio border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {loadError}
        </p>
      ) : null}

      {org ? (
        <Card>
          <CardBody className="space-y-4">
            <div>
              <p className="studio-label">Name</p>
              <p className="mt-1 text-lg font-medium text-ink-900">{org.name}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="studio-label">Slug</p>
                <p className="mt-1 font-mono text-sm text-ink-700">{org.slug}</p>
              </div>
              <div>
                <p className="studio-label">Public ID</p>
                <p className="mt-1 truncate font-mono text-sm text-ink-700">{org.publicId}</p>
              </div>
              <div>
                <p className="studio-label">Auth mode</p>
                <p className="mt-1 text-sm capitalize text-ink-700">{org.authMode}</p>
              </div>
              <div>
                <p className="studio-label">Allowed domains</p>
                <p className="mt-1 text-sm text-ink-700">
                  {org.allowedDomains.length > 0 ? org.allowedDomains.join(', ') : '—'}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      ) : null}
    </>
  );
}
