import { InventoryProduct } from '@erganis/studio-shared';
import { Card } from '@/components/ui/card';

function formatPrice(cents: number | null): string {
  if (cents === null) {
    return '—';
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    cents / 100,
  );
}

export function ProductTable({ products }: { products: InventoryProduct[] }) {
  if (products.length === 0) {
    return (
      <Card className="border-dashed bg-linen-50 p-10 text-center shadow-none">
        <p className="font-display text-xl text-ink-700">Your catalog is empty</p>
        <p className="mt-2 text-sm text-ink-500">
          Add your first material, fixture, or furnishing above.
        </p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-warm-border bg-linen-50 text-xs uppercase tracking-wide text-ink-500">
          <tr>
            <th className="px-5 py-3.5 font-medium">Name</th>
            <th className="px-5 py-3.5 font-medium">SKU</th>
            <th className="px-5 py-3.5 font-medium">Manufacturer</th>
            <th className="px-5 py-3.5 font-medium">Unit price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.publicId} className="border-b border-linen-100 last:border-0">
              <td className="px-5 py-3.5 font-medium text-ink-900">{product.name}</td>
              <td className="px-5 py-3.5 text-ink-600">{product.sku ?? '—'}</td>
              <td className="px-5 py-3.5 text-ink-600">{product.manufacturer ?? '—'}</td>
              <td className="px-5 py-3.5 tabular-nums text-ink-600">
                {formatPrice(product.unitPriceCents)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
