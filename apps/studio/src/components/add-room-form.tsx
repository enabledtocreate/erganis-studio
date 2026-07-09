'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createBrowserClient, config } from '@/lib/client-session';

interface AddRoomFormProps {
  projectPublicId: string;
}

export function AddRoomForm({ projectPublicId }: AddRoomFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
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
        surfaceId: 'room',
        action: 'save',
        payload: { projectPublicId, name },
      });
      setName('');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save room');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardBody>
        <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <p className="studio-label mb-2">Add room</p>
            <Input
              placeholder="Room name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving…' : 'Add room'}
          </Button>
          {error ? <p className="w-full text-sm text-red-700">{error}</p> : null}
        </form>
      </CardBody>
    </Card>
  );
}
