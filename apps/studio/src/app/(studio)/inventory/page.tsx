import { InventoryProduct } from '@erganis/studio-shared';
import { AddProductForm } from '@/components/add-product-form';
import { ProductTable } from '@/components/product-table';
import { StudioPageHeader } from '@/components/studio-page-header';
import { loadInventoryProducts } from '@/lib/inventory';

export default async function InventoryPage() {
  let products: InventoryProduct[] = [];
  let loadError: string | null = null;
  try {
    products = await loadInventoryProducts();
  } catch {
    loadError = 'Could not load products — is Core running with the inventory module enabled?';
  }

  return (
    <>
      <StudioPageHeader
        eyebrow="Inventory"
        title="Product catalog"
        description={
          <>
            Materials, fixtures, and FF&E for your firm. Saves through the Core operation envelope (
            <code className="rounded bg-linen-100 px-1.5 py-0.5 text-xs text-ink-700">
              inventory.save
            </code>
            ).
          </>
        }
      />

      {loadError ? (
        <p className="mb-6 rounded-studio border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {loadError}
        </p>
      ) : null}

      <div className="space-y-6">
        <AddProductForm />
        <ProductTable products={products} />
      </div>
    </>
  );
}
