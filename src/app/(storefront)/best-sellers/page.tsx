import { getBestSellingProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/product/product-card";

export default async function BestSellersPage() {
    const products = await getBestSellingProducts(100);

    return (
        <main className="px-5 py-14 sm:px-6 lg:px-10 lg:py-20">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-12 max-w-2xl">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-lyra-muted">
                        Customer Favorites
                    </p>

                    <h1 className="mt-2 font-display text-4xl tracking-tight text-lyra-black sm:text-5xl">
                        Best Sellers
                    </h1>

                    <p className="mt-4 max-w-xl text-sm leading-6 text-lyra-muted">
                        Discover the pieces our customers are choosing again
                        and again.
                    </p>
                </div>

                {/* Product Grid */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="border border-dashed border-lyra-border px-6 py-20 text-center">
                        <p className="font-display text-xl text-lyra-black">
                            Best sellers are coming soon
                        </p>

                        <p className="mt-2 text-sm text-lyra-muted">
                            Once customers start discovering LYRA, their
                            favorites will appear here.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}