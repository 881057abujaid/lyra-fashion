import Link from "next/link";
import { Plus } from "lucide-react";
import { z } from "zod";

import { getAdminProductCategories, getAdminProducts } from "@/lib/data/admin-products";
import { ProductFilters } from "@/components/admin/products/product-filters";
import { ProductTable } from "@/components/admin/products/product-table";
import { ProductPagination } from "@/components/admin/products/product-pagination";

const ProductFiltersSchema = z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    stock: z.enum(["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"]).optional(),
});

type ProductsPageProps = {
    searchParams: Promise<{
        search?: string;
        category?: string;
        stock?: string;
        page?: string;
    }>;
};

export default async function AdminProductsPage({
    searchParams,
}: ProductsPageProps) {
    const params = await searchParams;

    const parsedFilters = ProductFiltersSchema.safeParse({
        search: params.search,
        category: params.category,
        stock: params.stock,
    });

    const filters = parsedFilters.success
        ? parsedFilters.data
        : {};

    const page = Math.max(
        1,
        Number.isInteger(Number(params.page))
            ? Number(params.page)
            : 1
    );

    const [result, categories] = await Promise.all([
        getAdminProducts(
            {
                search: filters.search,
                category: filters.category,
                stock: filters.stock,
            },
            page,
            20
        ),
        getAdminProductCategories(),
    ]);

    const queryParams = new URLSearchParams();

    if (filters.search) {
        queryParams.set("search", filters.search);
    }

    if (filters.category) {
        queryParams.set("category", filters.category);
    }

    if (filters.stock) {
        queryParams.set("stock", filters.stock);
    }

    return (
        <div className="px-5 py-8 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="flex flex-col gap-5 border-b border-lyra-border pb-8 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-lyra-muted">
                            Catalog
                        </p>

                        <h1 className="mt-2 font-display text-3xl text-lyra-black sm:text-4xl">
                            Products
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-lyra-muted">
                            Manage your LYRA Fashion product catalog,
                            pricing and inventory.
                        </p>
                    </div>

                    <Link
                        href="/admin/products/new"
                        className="inline-flex h-11 items-center justify-center gap-2 bg-lyra-black px-5 text-[10px] uppercase tracking-[0.16em] text-lyra-white transition-opacity hover:opacity-80"
                    >
                        <Plus className="h-4 w-4" />
                        Add Product
                    </Link>
                </div>

                {/* Filters */}
                <div className="mt-6">
                    <ProductFilters categories={categories} />
                </div>

                {/* Results */}
                <div className="mt-6">
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-lyra-muted">
                            {result.total}{" "}
                            {result.total === 1 ? "Product" : "Products"}
                        </p>
                    </div>

                    <ProductTable products={result.products} />

                    <ProductPagination
                        page={result.page}
                        totalPages={result.totalPages}
                        total={result.total}
                        pageSize={result.pageSize}
                        queryString={queryParams.toString()}
                    />
                </div>
            </div>
        </div>
    );
}