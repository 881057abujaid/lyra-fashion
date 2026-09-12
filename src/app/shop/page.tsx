import { getProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/product/product-card";
import { ShopFilters } from "@/components/shop/shop-filters";
import Link from "next/link";

type ShopPageProps = {
    searchParams: Promise<{
        search?: string;
        category?: string;
        sort?: string;
    }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
    const params = await searchParams;
    const search = params.search;
    const category = params.category;
    const sort = params.sort === "price-low" ||
        params.sort === "price-high" ||
        params.sort === "featured" ?
        params.sort : "newest";

    const products = await getProducts({ category, sort, search });

    return (
        <main className="mx-auto max-w-7xl px-6 py-16">
            {/* Header */}
            <div className="flex items-end justify-between border-b border-lyra-border pb-6">
                <div>
                    <p className="tex-xs uppercase tracking-[0.2em] text-lyra-muted">
                        Shop
                    </p>

                    <h1 className="font-display mt-3 text-4xl tracking-tight sm:text-5xl">
                        {search ? `Search results for "${search}"` : "All Pieces"}
                    </h1>
                </div>
                <p className="text-sm text-lyra-muted">
                    {products.length}{" "}
                    {products.length === 1 ? 'Product' : 'Products'}
                </p>
            </div>

            <ShopFilters />

            {/* Product Grid */}
            {products.length > 0 ? (
                <div className="mt-10 grid grid-cols gap-x-5 gap-y-12 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-16">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex min-h-90 items-center justify-center">
                    <div className="max-w-md text-center">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-lyra-muted">
                            No Results
                        </p>

                        <h2 className="font-display mt-4 text-3xl tracking-tight">
                            No pieces found
                        </h2>

                        {search && (
                            <p className="mt-3 text-sm leading-6 text-lyra-muted">
                                We couldn't find anything matching{" "}
                                <span className="text-lyra-black">
                                    "{search}"
                                </span>
                                .
                            </p>
                        )}
                        <Link
                            href="/shop"
                            className="mt-7 inline-block bg-lyra-black px-6 py-3 text-xs uppercase tracking-[0.16em] text-lyra-white transition-opacity hover:opacity-85"
                        >
                            View All Pieces
                        </Link>
                    </div>
                </div>
            )}
        </main>
    );
}