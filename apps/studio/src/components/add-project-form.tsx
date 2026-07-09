'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createBrowserClient, config } from '@/lib/client-session';

export function AddProjectForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phase, setPhase] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const client = createBrowserClient();
      await client.executeOperation({
        orgSlug: config.defaultOrgSlug,
        surfaceId: 'project',
        action: 'save',
        payload: { name, phase: phase || null },
      });
      setName('');
      setPhase('');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardBody>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <p className="studio-label">New project</p>
            <p className="mt-1 text-sm text-ink-600">Add a client project to your firm</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              placeholder="Project name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              placeholder="Phase (e.g. Schematic design)"
              value={phase}
              onChange={(e) => setPhase(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving…' : 'Create project'}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
