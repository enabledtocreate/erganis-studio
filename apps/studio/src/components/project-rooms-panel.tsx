'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AssignmentRecord,
  InventoryProduct,
  RoomRecord,
} from '@erganis/studio-shared';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createBrowserClient, config } from '@/lib/client-session';

interface ProjectRoomsPanelProps {
  projectPublicId: string;
  rooms: RoomRecord[];
  assignments: AssignmentRecord[];
  catalog: InventoryProduct[];
}

export function ProjectRoomsPanel({
  projectPublicId,
  rooms,
  assignments,
  catalog,
}: ProjectRoomsPanelProps) {
  const router = useRouter();
  const [selectedRoom, setSelectedRoom] = useState<string>('project');
  const [productPublicId, setProductPublicId] = useState(catalog[0]?.publicId ?? '');
  const [quantity, setQuantity] = useState('1');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredAssignments = assignments.filter((a) => {
    if (selectedRoom === 'project') {
      return a.roomPublicId === null;
    }
    return a.roomPublicId === selectedRoom;
  });

  async function assignProduct(event: FormEvent) {
    event.preventDefault();
    if (!productPublicId) {
      setError('Select a catalog product');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const client = createBrowserClient();
      await client.executeOperation({
        orgSlug: config.defaultOrgSlug,
        surfaceId: 'assignment',
        action: 'save',
        payload: {
          projectPublicId,
          roomPublicId: selectedRoom === 'project' ? null : selectedRoom,
          productPublicId,
          quantity: Number(quantity) || 1,
        },
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign product');
    } finally {
      setLoading(false);
    }
  }

  async function removeAssignment(publicId: string) {
    setLoading(true);
    setError(null);
    try {
      const client = createBrowserClient();
      await client.executeOperation({
        orgSlug: config.defaultOrgSlug,
        surfaceId: 'assignment',
        action: 'save',
        payload: { projectPublicId, publicId, unassign: true },
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove assignment');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <Card>
        <CardBody className="space-y-1 p-3">
          <p className="studio-label px-2 pb-2">Rooms</p>
          <button
            type="button"
            onClick={() => setSelectedRoom('project')}
            className={`w-full rounded-studio px-3 py-2 text-left text-sm ${
              selectedRoom === 'project'
                ? 'bg-linen-100 font-medium text-ink-950'
                : 'text-ink-600 hover:bg-linen-50'
            }`}
          >
            Project-wide
          </button>
          {rooms.map((room) => (
            <button
              key={room.publicId}
              type="button"
              onClick={() => setSelectedRoom(room.publicId)}
              className={`w-full rounded-studio px-3 py-2 text-left text-sm ${
                selectedRoom === room.publicId
                  ? 'bg-linen-100 font-medium text-ink-950'
                  : 'text-ink-600 hover:bg-linen-50'
              }`}
            >
              {room.name}
            </button>
          ))}
          {rooms.length === 0 ? (
            <p className="px-2 py-2 text-xs text-ink-400">Add rooms to organize inventory.</p>
          ) : null}
        </CardBody>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardBody>
            <p className="studio-label">
              Inventory —{' '}
              {selectedRoom === 'project'
                ? 'project-wide'
                : rooms.find((r) => r.publicId === selectedRoom)?.name}
            </p>
            {filteredAssignments.length === 0 ? (
              <p className="mt-3 text-sm text-ink-500">No items assigned yet.</p>
            ) : (
              <ul className="mt-3 divide-y divide-warm-border">
                {filteredAssignments.map((item) => (
                  <li
                    key={item.publicId}
                    className="flex items-center justify-between gap-4 py-3 first:pt-0"
                  >
                    <div>
                      <p className="font-medium text-ink-900">{item.productName}</p>
                      <p className="text-xs text-ink-500">
                        {item.productSku ? `SKU ${item.productSku} · ` : ''}Qty {item.quantity}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={loading}
                      onClick={() => removeAssignment(item.publicId)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <form onSubmit={assignProduct} className="space-y-4">
              <p className="studio-label">Assign from catalog</p>
              {catalog.length === 0 ? (
                <p className="text-sm text-ink-500">
                  Add products in Inventory first, then assign them here.
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-[1fr_100px_auto]">
                  <select
                    className="rounded-studio border border-warm-border bg-paper px-3 py-2 text-sm text-ink-900"
                    value={productPublicId}
                    onChange={(e) => setProductPublicId(e.target.value)}
                  >
                    {catalog.map((product) => (
                      <option key={product.publicId} value={product.publicId}>
                        {product.name}
                        {product.sku ? ` (${product.sku})` : ''}
                      </option>
                    ))}
                  </select>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  <Button type="submit" disabled={loading}>
                    Assign
                  </Button>
                </div>
              )}
              {error ? <p className="text-sm text-red-700">{error}</p> : null}
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
