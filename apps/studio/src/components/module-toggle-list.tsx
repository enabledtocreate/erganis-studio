'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminModuleView } from '@erganis/studio-shared';
import { Card, CardBody } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { createBrowserClient, config } from '@/lib/client-session';

interface ModuleToggleListProps {
  modules: AdminModuleView[];
  registryUrl: string;
  registryNote: string;
}

export function ModuleToggleList({ modules, registryUrl, registryNote }: ModuleToggleListProps) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function toggle(moduleId: string, enabled: boolean) {
    setPending(moduleId);
    setError(null);
    try {
      const client = createBrowserClient();
      await client.setAdminModuleEnabled(config.defaultOrgSlug, moduleId, enabled);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update module');
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="border-dashed">
        <CardBody>
          <p className="studio-label">Module registry</p>
          <p className="mt-2 text-sm text-ink-600">{registryNote}</p>
          <a
            href={registryUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-sm font-medium text-ink-900 hover:underline"
          >
            {registryUrl} →
          </a>
        </CardBody>
      </Card>

      {error ? (
        <p className="rounded-studio border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <div className="space-y-3">
        {modules.map((mod) => (
          <Card key={mod.moduleId}>
            <CardBody className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-ink-950">{mod.name}</h3>
                  <span className="font-mono text-xs text-ink-400">{mod.moduleId}</span>
                  {!mod.shipByDefault ? (
                    <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-800">
                      opt-in
                    </span>
                  ) : null}
                </div>
                {mod.description ? (
                  <p className="mt-1 text-sm text-ink-600">{mod.description}</p>
                ) : null}
                <p className="mt-2 text-xs text-ink-400">
                  v{mod.version} · {mod.operations.length} operation
                  {mod.operations.length === 1 ? '' : 's'}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {mod.operations.map((op) => (
                    <span
                      key={op.stepId}
                      className="rounded bg-linen-100 px-2 py-0.5 font-mono text-[10px] text-ink-600"
                    >
                      {op.surfaceId}.{op.action}
                    </span>
                  ))}
                </div>
              </div>
              <Switch
                checked={mod.enabled}
                disabled={pending === mod.moduleId}
                label={`Toggle ${mod.name}`}
                onChange={(enabled) => toggle(mod.moduleId, enabled)}
              />
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
