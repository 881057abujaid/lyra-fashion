import { getAdminInventory } from "@/lib/data/admin-inventory";

function getStockStatus(stock: number) {
    if (stock === 0) {
        return {
            label: "Out of Stock",
            className: "text-red-600",
        };
    }

    if (stock <= 5) {
        return {
            label: "Low Stock",
            className: "text-amber-600",
        };
    }

    return {
        label: "In Stock",
        className: "text-emerald-600",
    };
}

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
                <div className="overflow-hidden border border-lyra-border bg-lyra-white">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-180">
                            <thead>
                                <tr className="border-b border-lyra-border bg-lyra-soft">
                                    <th className="px-5 py-4 text-left text-[10px] font-medium uppercase tracking-[0.14em] text-lyra-muted">
                                        Product
                                    </th>

                                    <th className="px-5 py-4 text-left text-[10px] font-medium uppercase tracking-[0.14em] text-lyra-muted">
                                        SKU
                                    </th>

                                    <th className="px-5 py-4 text-left text-[10px] font-medium uppercase tracking-[0.14em] text-lyra-muted">
                                        Variant
                                    </th>

                                    <th className="px-5 py-4 text-left text-[10px] font-medium uppercase tracking-[0.14em] text-lyra-muted">
                                        Stock
                                    </th>

                                    <th className="px-5 py-4 text-left text-[10px] font-medium uppercase tracking-[0.14em] text-lyra-muted">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {products.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-16 text-center"
                                        >
                                            <p className="font-display text-xl text-lyra-black">
                                                No products found
                                            </p>

                                            <p className="mt-2 text-sm text-lyra-muted">
                                                Add products with variants to
                                                start managing inventory.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product) =>
                                        product.variants.length > 0 ? (
                                            product.variants.map(
                                                (variant, index) => {
                                                    const status =
                                                        getStockStatus(
                                                            variant.stock,
                                                        );

                                                    return (
                                                        <tr
                                                            key={variant.id}
                                                            className="border-b border-lyra-border last:border-b-0"
                                                        >
                                                            <td className="px-5 py-4">
                                                                {index === 0 ? (
                                                                    <p className="text-sm font-medium text-lyra-black">
                                                                        {
                                                                            product.name
                                                                        }
                                                                    </p>
                                                                ) : (
                                                                    <span className="text-sm text-lyra-subtle">
                                                                        —
                                                                    </span>
                                                                )}
                                                            </td>

                                                            <td className="px-5 py-4 text-sm text-lyra-muted">
                                                                {index === 0
                                                                    ? product.sku
                                                                    : "—"}
                                                            </td>

                                                            <td className="px-5 py-4 text-sm text-lyra-muted">
                                                                {variant.size}
                                                            </td>

                                                            <td className="px-5 py-4 text-sm font-medium text-lyra-black">
                                                                {variant.stock}
                                                            </td>

                                                            <td className="px-5 py-4">
                                                                <span
                                                                    className={`text-[10px] uppercase tracking-[0.12em] ${status.className}`}
                                                                >
                                                                    {status.label}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                },
                                            )
                                        ) : (
                                            <tr
                                                key={product.id}
                                                className="border-b border-lyra-border last:border-b-0"
                                            >
                                                <td className="px-5 py-4">
                                                    <p className="text-sm font-medium text-lyra-black">
                                                        {product.name}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4 text-sm text-lyra-muted">
                                                    {product.sku}
                                                </td>

                                                <td
                                                    colSpan={3}
                                                    className="px-5 py-4 text-sm text-lyra-subtle"
                                                >
                                                    No variants
                                                </td>
                                            </tr>
                                        ),
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}