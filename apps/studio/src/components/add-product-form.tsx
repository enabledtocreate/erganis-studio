'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createBrowserClient, config } from '@/lib/client-session';

export function AddProductForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const client = createBrowserClient();
      const unitPriceCents =
        unitPrice.trim() === '' ? null : Math.round(parseFloat(unitPrice) * 100);
      await client.executeOperation({
        orgSlug: config.defaultOrgSlug,
        surfaceId: 'inventory',
        action: 'save',
        payload: {
          name,
          sku: sku || null,
          manufacturer: manufacturer || null,
          unitPriceCents,
        },
      });
      setName('');
      setSku('');
      setManufacturer('');
      setUnitPrice('');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardBody>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <p className="studio-label">Add to catalog</p>
            <p className="mt-1 text-sm text-ink-600">New material or FF&E item</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              placeholder="Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)} />
            <Input
              placeholder="Manufacturer"
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
            />
            <Input
              placeholder="Unit price (USD)"
              type="number"
              min="0"
              step="0.01"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving…' : 'Save product'}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
