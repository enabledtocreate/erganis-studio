import { AdminSubnav } from '@/components/admin-subnav';
import { ModuleToggleList } from '@/components/module-toggle-list';
import { StudioPageHeader } from '@/components/studio-page-header';
import { loadAdminModules } from '@/lib/admin';

export default async function AdminModulesPage() {
  let data: Awaited<ReturnType<typeof loadAdminModules>> | null = null;
  let loadError: string | null = null;
  try {
    data = await loadAdminModules();
  } catch {
    loadError = 'Could not load modules — ensure you are signed in as an org admin.';
  }

  return (
    <>
      <StudioPageHeader
        eyebrow="Admin"
        title="Modules"
        description="Enable or disable Erganis modules for your organization. Opt-in modules (like Developer) are off until you turn them on."
      />
      <AdminSubnav />

      {loadError ? (
        <p className="mb-6 rounded-studio border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {loadError}
        </p>
      ) : null}

      {data ? (
        <ModuleToggleList
          modules={data.modules}
          registryUrl={data.moduleRegistryUrl}
          registryNote={data.moduleRegistryNote}
        />
      ) : null}
    </>
  );
}
