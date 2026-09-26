import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Pencil } from "lucide-react";

import type { AdminProduct } from "@/lib/data/admin-products";

type ProductTableProps = {
    products: AdminProduct[];
};

function getTotalStock(product: AdminProduct) {
    return product.variants.reduce((total, variant) => total + variant.stock, 0);
}

function getStockStatus(product: AdminProduct) {
    const totalStock = getTotalStock(product);

    if (totalStock <= 0) {
        return {
            label: "Out of Stock",
            className: "border-red-200 bg-red-50 text-red-700",
        };
    }

    if (totalStock <= 5) {
        return {
            label: "Low Stock",
            className: "border-amber-200 bg-amber-50 text-amber-700",
        };
    }

    return {
        label: "In Stock",
        className: "border-green-200 bg-green-50 text-green-700",
    };
}

function formatPrice(price: number) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(price);
}

export function ProductTable({
    products,
}: ProductTableProps) {
    if (products.length === 0) {
        return (
            <div className="border border-lyra-border bg-lyra-white px-6 py-16 text-center">
                <p className="font-display text-2xl text-lyra-black">
                    No product found
                </p>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-lyra-muted">
                    Try changing your search or filters, or add a new product to your catalog.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden border border-lyra-border bg-lyra-white">
            {/* Desktop table */}
            <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-250">
                    <thead>
                        <tr className="border-b border-lyra-border bg-lyra-cream">
                            <th className="px-5 py-4 text-left text-[9px] uppercase tracking-[0.16em] text-lyra-muted">
                                Product
                            </th>
                            <th className="px-5 py-4 text-left text-[9px] uppercase tracking-[0.16em] text-lyra-muted">
                                SKU
                            </th>
                            <th className="px-5 py-4 text-left text-[9px] uppercase tracking-[0.16em] text-lyra-muted">
                                Category
                            </th>
                            <th className="px-5 py-4 text-left text-[9px] uppercase tracking-[0.16em] text-lyra-muted">
                                Price
                            </th>
                            <th className="px-5 py-4 text-left text-[9px] uppercase tracking-[0.16em] text-lyra-muted">
                                Stock
                            </th>
                            <th className="px-5 py-4 text-left text-[9px] uppercase tracking-[0.16em] text-lyra-muted">
                                Status
                            </th>
                            <th className="px-5 py-4 text-left text-[9px] uppercase tracking-[0.16em] text-lyra-muted">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product) => {
                            const totalStock = getTotalStock(product);
                            const stockStatus = getStockStatus(product);

                            return (
                                <tr
                                    key={product.id}
                                    className="border-b border-lyra-border last:border-b-0"
                                >
                                    {/* Product */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-lyra-beige">
                                                {product.images[0] ? (
                                                    <Image
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        fill
                                                        sizes="56px"
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-[8px] uppercase tracking-widest text-lyra-muted">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-lyra-black">
                                                    {product.name}
                                                </p>

                                                <div className="mt-1 flex flex-wrap gap-2">
                                                    {product.isFeatured && (
                                                        <span className="text-[8px] uppercase tracking-[0.12em] text-lyra-muted">
                                                            Featured
                                                        </span>
                                                    )}

                                                    {product.isNewArrival && (
                                                        <span className="text-[8px] uppercase tracking-[0.12em] text-lyra-muted">
                                                            New Arrival
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* SKU */}
                                    <td className="px-5 py-4">
                                        <span className="font-mono text-xs text-lyra-muted">
                                            {product.sku}
                                        </span>
                                    </td>

                                    {/* Category */}
                                    <td className="px-5 py-4">
                                        <span className="text-xs text-lyra-black">
                                            {product.category}
                                        </span>
                                    </td>

                                    {/* Price */}
                                    <td className="px-5 py-4">
                                        <div>
                                            <p className="text-sm text-lyra-black">
                                                {formatPrice(product.price)}
                                            </p>

                                            {product.compareAtPrice && (
                                                <p className="mt-0.5 text-[10px] text-lyra-subtle line-through">
                                                    {formatPrice(product.compareAtPrice)}
                                                </p>
                                            )}
                                        </div>
                                    </td>

                                    {/* Stock */}
                                    <td className="px-5 py-4">
                                        <div>
                                            <p className="text-sm text-lyra-black">
                                                {totalStock}
                                            </p>

                                            <div className="mt-1 flex flex-wrap gap-1.5">
                                                {product.variants.map(
                                                    (variant) => (
                                                        <span
                                                            key={variant.id}
                                                            className="text-[9px] text-lyra-muted"
                                                        >
                                                            {variant.size}:{variant.stock}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex border px-2.5 py-1 text-[9px] uppercase tracking-widest ${stockStatus.className}`}>
                                            {stockStatus.label}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-5 py-4">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="inline-flex h-9 w-9 items-center justify-center border border-lyra-border text-lyra-muted transition-colors hover:border-lyra-black hover:text-lyra-black"
                                                aria-label={`Edit ${product.name}`}
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </Link>

                                            <Link
                                                href={`/products/${product.slug}`}
                                                target="_blank"
                                                className="inline-flex h-9 w-9 items-center justify-center border border-lyra-border text-lyra-muted transition-colors hover:border-lyra-black hover:text-lyra-black"
                                            >
                                                <ArrowUpRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-lyra-border lg:hidden">
                {products.map((product) => {
                    const totalStock = getTotalStock(product);
                    const stockStatus = getStockStatus(product);

                    return (
                        <div
                            key={product.id}
                            className="p-4"
                        >
                            <div className="flex gap-4">
                                <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-lyra-beige">
                                    {product.images[0] ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            sizes="80px"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-[8px] uppercase tracking-widest text-lyra-muted">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-medium text-lyra-black">
                                                {product.name}
                                            </p>

                                            <p className="mt-1 font-mono text-[10px] text-lyra-muted">
                                                {product.sku}
                                            </p>
                                        </div>

                                        <span className={`shrink-0 border px-2 py-1 text-[8px] uppercase tracking-[0.08em] ${stockStatus.className}`}>
                                            {stockStatus.label}
                                        </span>
                                    </div>

                                    <div className="mt-4 flex items-end justify-between">
                                        <div>
                                            <p className="text-sm text-lyra-black">
                                                {formatPrice(product.price)}
                                            </p>

                                            <p className="mt-1 text-[10px] text-lyra-muted">
                                                {product.category} .{" "}
                                                {totalStock} units
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="inline-flex h-8 w-8 items-center justify-center border border-lyra-border"
                                                aria-label={`Edit ${product.name}`}
                                            >
                                                <Pencil className="h-3.5 w-3.5 text-lyra-muted transition-colors hover:border-lyra-black hover:text-lyra-black" />
                                            </Link>

                                            <Link
                                                href={`/products/${product.slug}`}
                                                target="_blank"
                                                className="inline-flex h-8 w-8 items-center justify-center border border-lyra-border"
                                                aria-label={`View ${product.name}`}
                                            >
                                                <ArrowUpRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}