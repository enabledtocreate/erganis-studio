import { AdminSubnav } from '@/components/admin-subnav';
import { Card, CardBody } from '@/components/ui/card';
import { StudioPageHeader } from '@/components/studio-page-header';
import { loadAdminUsers } from '@/lib/admin';

export default async function AdminUsersPage() {
  let users: Awaited<ReturnType<typeof loadAdminUsers>> = [];
  let loadError: string | null = null;
  try {
    users = await loadAdminUsers();
  } catch {
    loadError = 'Could not load users — ensure you are signed in as an org admin.';
  }

  return (
    <>
      <StudioPageHeader
        eyebrow="Admin"
        title="Users"
        description="Members of your organization and their assigned roles."
      />
      <AdminSubnav />

      {loadError ? (
        <p className="mb-6 rounded-studio border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {loadError}
        </p>
      ) : null}

      <Card>
        <CardBody className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-warm-border text-xs uppercase tracking-wide text-ink-400">
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userPublicId} className="border-b border-warm-border last:border-0">
                  <td className="px-5 py-4">
                    <p className="font-medium text-ink-900">
                      {user.displayName ?? user.email}
                    </p>
                    {user.displayName ? (
                      <p className="text-xs text-ink-500">{user.email}</p>
                    ) : null}
                  </td>
                  <td className="px-5 py-4 text-ink-700">
                    {user.roleName}
                    {user.isAdmin ? (
                      <span className="ml-2 rounded bg-linen-100 px-1.5 py-0.5 text-xs text-ink-600">
                        admin
                      </span>
                    ) : null}
                  </td>
                  <td className="px-5 py-4 text-ink-500">
                    {new Date(user.joinedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {users.length === 0 && !loadError ? (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center text-ink-500">
                    No members found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </>
  );
}
