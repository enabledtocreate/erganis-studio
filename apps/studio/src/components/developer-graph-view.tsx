import { DeveloperGraphData } from '@erganis/studio-shared';
import { Card, CardBody } from '@/components/ui/card';

interface DeveloperGraphViewProps {
  graph: DeveloperGraphData;
  schemas: Array<{ id: string; path: string; description: string }>;
}

export function DeveloperGraphView({ graph, schemas }: DeveloperGraphViewProps) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="studio-label mb-3">Installed modules</h2>
        <div className="grid gap-3 lg:grid-cols-2">
          {graph.modules.map((mod) => (
            <Card key={mod.moduleId}>
              <CardBody>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium text-ink-950">{mod.name}</h3>
                    <p className="font-mono text-xs text-ink-400">{mod.moduleId}</p>
                  </div>
                  {!mod.shipByDefault ? (
                    <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-800">
                      opt-in
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-xs text-ink-500">
                  Surfaces: {mod.surfaces.join(', ') || '—'}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="studio-label mb-3">Link types (contract catalog)</h2>
        <div className="space-y-2">
          {graph.linkTypes.map((link) => (
            <Card key={link.id}>
              <CardBody className="py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-ink-900">{link.name}</span>
                  <span className="rounded bg-linen-100 px-1.5 py-0.5 text-[10px] uppercase text-ink-500">
                    {link.linkKind}
                  </span>
                </div>
                <p className="mt-2 font-mono text-xs text-ink-600">
                  {link.fromModule}.{link.fromEntity}.{link.fromField} → {link.toModule}.
                  {link.toEntity}.{link.toField}
                </p>
                <p className="mt-1 text-sm text-ink-500">{link.description}</p>
                {link.via ? <p className="mt-1 text-xs text-ink-400">via {link.via}</p> : null}
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="studio-label mb-3">Live ID connections (your org)</h2>
        {graph.liveLinks.length === 0 ? (
          <p className="text-sm text-ink-500">No live links yet — seed demo data or create projects.</p>
        ) : (
          <Card>
            <CardBody className="overflow-x-auto p-0">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-warm-border text-xs uppercase tracking-wide text-ink-400">
                    <th className="px-5 py-3 font-medium">From</th>
                    <th className="px-5 py-3 font-medium">To</th>
                    <th className="px-5 py-3 font-medium">Context</th>
                    <th className="px-5 py-3 font-medium">Link type</th>
                  </tr>
                </thead>
                <tbody>
                  {graph.liveLinks.map((link, index) => (
                    <tr key={`${link.fromPublicId}-${link.toPublicId}-${index}`} className="border-b border-warm-border last:border-0">
                      <td className="px-5 py-3">
                        <p className="font-medium text-ink-900">{link.fromLabel}</p>
                        <p className="font-mono text-xs text-ink-400">{link.fromPublicId}</p>
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-ink-800">{link.toLabel}</p>
                        <p className="font-mono text-xs text-ink-400">{link.toPublicId}</p>
                      </td>
                      <td className="px-5 py-3 text-ink-600">
                        {link.contextLabel ?? '—'}
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-ink-500">{link.linkTypeId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        )}
      </section>

      <section>
        <h2 className="studio-label mb-3">Entity samples</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {graph.entities.map((entity) => (
            <Card key={`${entity.moduleId}-${entity.publicId}`}>
              <CardBody>
                <p className="text-[10px] uppercase tracking-wide text-ink-400">
                  {entity.moduleId}.{entity.entity}
                </p>
                <p className="mt-1 font-medium text-ink-900">{entity.label}</p>
                <p className="mt-1 truncate font-mono text-xs text-ink-500">{entity.publicId}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="studio-label mb-3">Operation pipeline</h2>
        <Card>
          <CardBody className="overflow-x-auto p-0">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-warm-border text-xs uppercase tracking-wide text-ink-400">
                  <th className="px-5 py-3 font-medium">Module</th>
                  <th className="px-5 py-3 font-medium">Surface</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                  <th className="px-5 py-3 font-medium">Handler</th>
                </tr>
              </thead>
              <tbody>
                {graph.pipeline.map((step) => (
                  <tr key={`${step.moduleId}-${step.stepId}`} className="border-b border-warm-border last:border-0">
                    <td className="px-5 py-3 font-mono text-xs">{step.moduleId}</td>
                    <td className="px-5 py-3">{step.surfaceId}</td>
                    <td className="px-5 py-3">{step.action}</td>
                    <td className="px-5 py-3 font-mono text-xs text-ink-500">{step.handler}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </section>

      <section>
        <h2 className="studio-label mb-3">Contracts</h2>
        <div className="grid gap-3 lg:grid-cols-2">
          {graph.contracts.map((contract) => (
            <Card key={contract.id}>
              <CardBody>
                <p className="font-medium text-ink-900">{contract.id}</p>
                <p className="mt-1 font-mono text-xs text-ink-500">{contract.path}</p>
                <p className="mt-2 text-sm text-ink-600">{contract.endpoint}</p>
              </CardBody>
            </Card>
          ))}
        </div>
        {schemas.length > 0 ? (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
              Loaded from Core
            </p>
            {schemas.map((schema) => (
              <Card key={schema.id}>
                <CardBody className="py-3">
                  <p className="text-sm font-medium text-ink-800">{schema.description}</p>
                  <p className="font-mono text-xs text-ink-400">{schema.path}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
