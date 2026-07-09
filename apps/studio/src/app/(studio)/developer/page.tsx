import { DeveloperGraphView } from '@/components/developer-graph-view';
import { StudioPageHeader } from '@/components/studio-page-header';
import { loadCompositionSchemas, loadDeveloperGraph } from '@/lib/developer';

export default async function DeveloperPage() {
  let graph = null;
  let schemas: Awaited<ReturnType<typeof loadCompositionSchemas>>['schemas'] = [];
  let loadError: string | null = null;

  try {
    [graph, { schemas }] = await Promise.all([loadDeveloperGraph(), loadCompositionSchemas()]);
  } catch {
    loadError =
      'Developer module is not available. Enable it in Admin → Modules and ensure Core loads MODULES_EXTRA_ROOTS=../../developer';
  }

  return (
    <>
      <StudioPageHeader
        eyebrow="Developer"
        title="Module graph"
        description="Debug how modules, public IDs, and contracts connect across your Erganis pipeline."
      />

      {loadError ? (
        <p className="mb-6 rounded-studio border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {loadError}
        </p>
      ) : null}

      {graph ? <DeveloperGraphView graph={graph} schemas={schemas} /> : null}
    </>
  );
}
