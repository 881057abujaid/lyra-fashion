import { getAdminInventory } from "@/lib/data/admin-inventory";
import { InventoryTable } from "@/components/admin/inventory/inventory-table";

export default async function AdminInventoryPage() {
    const products = await getAdminInventory();

    return (
        <div className="px-6 py-8 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Page Header */}
                <div className="mb-8">
                    <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-lyra-subtle">
                        Operations
                    </p>

                    <h1 className="font-display text-3xl tracking-tight text-lyra-black">
                        Inventory
                    </h1>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-lyra-muted">
                        Monitor product variants and current stock levels across
                        the LYRA catalog.
                    </p>
                </div>

                {/* Inventory Table */}
                <InventoryTable products={products} />
            </div>
        </div>
    );
}