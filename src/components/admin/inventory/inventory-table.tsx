"use client";

import { useState } from "react";

import { StockAdjustmentModal } from "@/components/admin/inventory/stock-adjustment-modal";

type InventoryProduct = {
    id: string;
    name: string;
    sku: string;
    variants: {
        id: string;
        size: string;
        stock: number;
    }[];
};

type InventoryTableProps = {
    products: InventoryProduct[];
};

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

export function InventoryTable({ products }: InventoryTableProps) {
    const [selectedVariant, setSelectedVariant] = useState<{
        variantId: string;
        productName: string;
        size: string;
        currentStock: number;
    } | null>(null);

    return (
        <>
            <div className="overflow-hidden border border-lyra-border bg-lyra-white">
                <table className="w-full text-left">
                    <thead className="border-b border-lyra-border bg-lyra-cream">
                        <tr>
                            <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-lyra-muted">
                                Product
                            </th>

                            <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-lyra-muted">
                                SKU
                            </th>

                            <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-lyra-muted">
                                Variant
                            </th>

                            <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-lyra-muted">
                                Stock
                            </th>

                            <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-lyra-muted">
                                Status
                            </th>

                            <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-lyra-muted">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-lyra-border">
                        {products.map((product) => {
                            if (product.variants.length === 0) {
                                return (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 font-medium text-lyra-black">
                                            {product.name}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-lyra-muted">
                                            {product.sku}
                                        </td>

                                        <td
                                            colSpan={4}
                                            className="px-6 py-4 text-sm text-lyra-muted"
                                        >
                                            No variants
                                        </td>
                                    </tr>
                                );
                            }

                            return product.variants.map((variant, index) => {
                                const status = getStockStatus(variant.stock);

                                return (
                                    <tr key={variant.id}>
                                        <td className="px-6 py-4 font-medium text-lyra-black">
                                            {index === 0 ? product.name : "—"}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-lyra-muted">
                                            {index === 0 ? product.sku : "—"}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-neutral-700">
                                            {variant.size}
                                        </td>

                                        <td className="px-6 py-4 text-sm font-medium text-lyra-black">
                                            {variant.stock}
                                        </td>

                                        <td
                                            className={`px-6 py-4 text-sm font-medium ${status.className}`}
                                        >
                                            {status.label}
                                        </td>

                                        <td className="px-6 py-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedVariant({
                                                        variantId: variant.id,
                                                        productName: product.name,
                                                        size: variant.size,
                                                        currentStock: variant.stock,
                                                    })
                                                }
                                                className="text-sm px-4 py-2 uppercase tracking-tight border border-lyra-black bg-lyra-black text-lyra-white transition-opacity hover:opacity-80"
                                            >
                                                Edit Stock
                                            </button>
                                        </td>
                                    </tr>
                                );
                            });
                        })}
                    </tbody>
                </table>
            </div>

            {selectedVariant && (
                <StockAdjustmentModal
                    variantId={selectedVariant.variantId}
                    productName={selectedVariant.productName}
                    size={selectedVariant.size}
                    currentStock={selectedVariant.currentStock}
                    onClose={() => setSelectedVariant(null)}
                />
            )}
        </>
    );
}