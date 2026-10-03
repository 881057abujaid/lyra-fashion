import Link from "next/link";

import { getBestSellingProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/product/product-card";

export async function BestSellersSection() {
    const products = await getBestSellingProducts(4);

    if (products.length === 0) {
        return null;
    }

    return (
        <section className="px-5 py-16 sm:px-6 lg:px-10 lg:py-20">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-lyra-muted">
                            Best Sellers
                        </p>

                        <h2 className="mt-2 font-display text-3xl tracking-tight text-lyra-black sm:text-4xl">
                            Loved by LYRA
                        </h2>

                        <p className="mt-3 max-w-md text-sm leading-6 text-lyra-muted">
                            Discover the pieces our customers are choosing again and again.
                        </p>
                    </div>

                    <Link
                        href="/best-sellers"
                        className="w-fit border-b border-lyra-black pb-1 text-[10px] uppercase tracking-[0.16em] text-lyra-black transition-opacity hover:opacity-60"
                    >
                        View All
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}