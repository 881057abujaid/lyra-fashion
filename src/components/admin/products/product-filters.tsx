"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";

type ProductFiltersProps = {
    categories: string[];
};

export function ProductFilters({
    categories,
}: ProductFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("search") ?? "");

    const currentCategory = searchParams.get("category") ?? "";
    const currentStock = searchParams.get("Stock") ?? "";

    function applyFilters() {
        const params = new URLSearchParams();

        if (search.trim()) {
            params.set("search", search.trim());
        }

        if (currentCategory) {
            params.set("category", currentCategory);
        }

        if (currentStock) {
            params.set("stock", currentStock);
        }

        params.delete("page");

        router.push(`/admin/products?${params.toString()}`);
    }

    function updateFilters(
        key: "category" | "stock",
        value: string
    ) {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        params.delete("page");

        router.push(`/admin/products?${params.toString()}`);
    }

    function clearFilters() {
        setSearch("");
        router.push(`/admin/products`);
    }

    const hasFilters = Boolean(search.trim()) ||
        Boolean(currentCategory) ||
        Boolean(currentStock);

    return (
        <div className="border border-lyra-border bg-lyra-white p-4">
            <div className="flex flex-col gap-3 lg:flex-row">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-lyra-subtle" />

                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                applyFilters();
                            }
                        }}
                        placeholder="Search by product name or SKU..."
                        className="h-11 w-full border border-lyra-border bg-transparent pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-lyra-subtle focus:border-lyra-black"
                    />
                </div>

                {/* Category */}
                <select
                    value={currentCategory}
                    onChange={(event) => updateFilters("category", event.target.value)}
                    className="h-11 border border-lyra-border bg-lyra-white px-4 text-xs uppercase tracking-[0.08em] text-lyra-black outline-none focus:border-lyra-black lg:w-48"
                >
                    <option value="">All Categories</option>

                    {categories.map((category) => (
                        <option
                            key={category}
                            value={category}
                        >
                            {category}
                        </option>
                    ))}
                </select>

                {/* Stock */}
                <select
                    value={currentStock}
                    onChange={(event) => updateFilters("stock", event.target.value)}
                    className="h-11 border border-lyra-border bg-lyra-white px-4 text-xs uppercase tracking-[0.08em] text-lyra-black outline-none focus:border-lyra-black lg:w-44"
                >
                    <option value="">All Stock</option>
                    <option value="IN_STOCK">In Stock</option>
                    <option value="LOW_STOCK">Low Stock</option>
                    <option value="OUT_OF_STOCK">Out of Stock</option>
                </select>

                {/* Search button */}
                <button
                    type="button"
                    onClick={applyFilters}
                    className="h-11 bg-lyra-black px-6 text-[10px] uppercase tracking-[0.16em] text-lyra-white transition-opacity hover:opacity-80"
                >
                    Search
                </button>

                {/* Clear  */}
                {hasFilters && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="inline-flex h-11 items-center justify-center gap-2 border border-lyra-border px-4 text-[10px] uppercase tracking-[0.14em] text-lyra-muted transition-colors hover:border-lyra-black"
                    >
                        <X className="h-3 w-3.5" />
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
}