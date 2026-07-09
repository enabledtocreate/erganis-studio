import { StudioPageHeader } from '@/components/studio-page-header';
import { AddProjectForm } from '@/components/add-project-form';
import { ProjectList } from '@/components/project-list';
import { loadProjects } from '@/lib/projects';

export default async function ProjectsPage() {
  let projects: Awaited<ReturnType<typeof loadProjects>> = [];
  let loadError: string | null = null;
  try {
    projects = await loadProjects();
  } catch {
    loadError =
      'Could not load projects — is Core running with the projects module enabled?';
  }

  return (
    <>
      <StudioPageHeader
        eyebrow="Projects"
        title="All projects"
        description="Client projects, rooms, and room-level inventory assignments."
      />

      {loadError ? (
        <p className="mb-6 rounded-studio border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {loadError}
        </p>
      ) : null}

      <div className="space-y-6">
        <AddProjectForm />
        <ProjectList projects={projects} />
      </div>
    </>
  );
}
