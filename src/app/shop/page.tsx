import { getProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/product/product-card";

export default async function ShopPage() {
    const products = await getProducts();

    return (
        <main className="mx-auto max-w-7xl px-6 py-16">
            {/* Header */}
            <div className="flex items-end justify-between border-b border-lyra-border pb-6">
                <div>
                    <p className="tex-xs uppercase tracking-[0.2em] text-lyra-muted">
                        Shop
                    </p>

                    <h1 className="font-display mt-3 text-5xl tracking-tight">
                        All Pieces
                    </h1>
                </div>
                <p className="text-sm text-lyra-muted">
                    {products.length} {products.length === 1 ? 'Product' : 'Products'}
                </p>
            </div>

            {/* Product Grid */}
            <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-16">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>
        </main>
    );
}