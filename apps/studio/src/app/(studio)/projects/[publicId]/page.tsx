import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AddRoomForm } from '@/components/add-room-form';
import { ProjectRoomsPanel } from '@/components/project-rooms-panel';
import { StudioPageHeader } from '@/components/studio-page-header';
import { loadInventoryProducts } from '@/lib/inventory';
import { loadProjectDetail } from '@/lib/projects';

interface ProjectDetailPageProps {
  params: { publicId: string };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  let detail: Awaited<ReturnType<typeof loadProjectDetail>> | null = null;
  let catalog: Awaited<ReturnType<typeof loadInventoryProducts>> = [];
  let loadError: string | null = null;

  try {
    [detail, catalog] = await Promise.all([
      loadProjectDetail(params.publicId),
      loadInventoryProducts(),
    ]);
  } catch {
    loadError = 'Could not load project — is Core running with projects enabled?';
  }

  if (!loadError && !detail?.project) {
    notFound();
  }

  const project = detail?.project;

  return (
    <>
      <div className="mb-2">
        <Link href="/projects" className="text-sm text-ink-500 hover:text-ink-800">
          ← All projects
        </Link>
      </div>

      <StudioPageHeader
        eyebrow="Project"
        title={project?.name ?? 'Project'}
        description={
          project?.phase ? (
            <span>{project.phase}</span>
          ) : (
            <span className="text-ink-500">No phase set</span>
          )
        }
      />

      {loadError ? (
        <p className="mb-6 rounded-studio border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {loadError}
        </p>
      ) : null}

      {project ? (
        <div className="space-y-6">
          <AddRoomForm projectPublicId={project.publicId} />
          <ProjectRoomsPanel
            projectPublicId={project.publicId}
            rooms={detail?.rooms ?? []}
            assignments={detail?.assignments ?? []}
            catalog={catalog}
          />
        </div>
      ) : null}
    </>
  );
}
