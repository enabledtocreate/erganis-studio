import Link from 'next/link';
import { CoreApiClient } from '@erganis/studio-shared';
import { Card, CardBody } from '@/components/ui/card';
import { StudioPageHeader } from '@/components/studio-page-header';
import { config } from '@/lib/config';
import { getServerSession } from '@/lib/server-session';
import { loadProjects } from '@/lib/projects';

async function getCoreHealth() {
  try {
    const client = new CoreApiClient(config.coreApiUrl);
    return await client.getHealth();
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const session = await getServerSession();
  const health = await getCoreHealth();
  const displayName = session?.user.displayName ?? session?.user.email ?? 'there';

  let projects: Awaited<ReturnType<typeof loadProjects>> = [];
  try {
    projects = await loadProjects();
  } catch {
    projects = [];
  }

  return (
    <>
      <StudioPageHeader
        eyebrow="Overview"
        title={`Good afternoon, ${displayName.split(' ')[0]}`}
        description="Your firm at a glance — we'll refine this view later."
      />

      {projects.length > 0 ? (
        <section className="grid gap-4 sm:grid-cols-3">
          {projects.slice(0, 3).map((project) => (
            <Link key={project.publicId} href={`/projects/${project.publicId}`}>
              <Card className="transition-colors hover:border-ink-300">
                <CardBody>
                  <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-ink-400">
                    Active project
                  </p>
                  <h2 className="mt-2 font-display text-xl text-ink-950">{project.name}</h2>
                  <p className="mt-1 text-sm text-ink-600">{project.phase ?? 'No phase set'}</p>
                </CardBody>
              </Card>
            </Link>
          ))}
        </section>
      ) : (
        <section className="rounded-studio border border-dashed border-warm-border bg-linen-50 px-6 py-10 text-center">
          <p className="text-sm text-ink-600">No projects yet.</p>
          <Link href="/projects" className="mt-2 inline-block text-sm font-medium text-ink-900 hover:underline">
            Create your first project →
          </Link>
        </section>
      )}

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardBody>
            <p className="studio-label">Your role</p>
            <p className="mt-2 text-lg font-medium text-ink-900">{session?.role.name}</p>
            <p className="mt-1 text-sm text-ink-500">{session?.org.name}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="studio-label">Core platform</p>
            <p className="mt-2 text-lg font-medium text-ink-900">
              {health ? (
                <span className="text-forest-600">{health.status}</span>
              ) : (
                <span className="text-[var(--warning,#b54708)]">Unreachable</span>
              )}
            </p>
            <p className="mt-1 text-sm text-ink-500">
              {health ? 'Connected to your firm data' : 'Start Core on port 5000'}
            </p>
          </CardBody>
        </Card>
      </section>

      <section className="mt-8">
        <p className="studio-label mb-3">Quick access</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            href="/projects"
            className="rounded-studio-xl border border-warm-border bg-paper px-5 py-4 shadow-card transition hover:border-ink-400"
          >
            <h3 className="font-display text-lg text-ink-950">Projects</h3>
            <p className="mt-1 text-sm text-ink-600">Rooms and assigned inventory</p>
          </Link>
          <Link
            href="/inventory"
            className="rounded-studio-xl border border-warm-border bg-paper px-5 py-4 shadow-card transition hover:border-ink-400"
          >
            <h3 className="font-display text-lg text-ink-950">Inventory</h3>
            <p className="mt-1 text-sm text-ink-600">Firm-wide product catalog</p>
          </Link>
          <Link
            href="/admin"
            className="rounded-studio-xl border border-warm-border bg-paper px-5 py-4 shadow-card transition hover:border-ink-400"
          >
            <h3 className="font-display text-lg text-ink-950">Admin</h3>
            <p className="mt-1 text-sm text-ink-600">Organization, users, roles</p>
          </Link>
        </div>
      </section>
    </>
  );
}
