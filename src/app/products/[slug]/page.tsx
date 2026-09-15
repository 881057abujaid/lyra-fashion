import { notFound } from "next/navigation";

import { ProductGallery } from "@/components/product/product-gallery";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import { ProductPurchase } from "@/components/product/product-purchase";
import { ProductInfo } from "@/components/product/product-info";
import { ProductCard } from "@/components/product/product-card";

type ProductPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function ProductPage({
    params,
}: ProductPageProps) {
    const { slug } = await params;

    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const relatedProducts = await getRelatedProducts(product.id, product.category);

    return (
        <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-16">
            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
                {/* Left - Product Gallery */}
                <ProductGallery
                    images={product.images}
                    name={product.name}
                />

                {/* Right - Product Information */}
                <div className="lg:sticky lg:top-28 lg:self-start">
                    <ProductInfo
                        productId={product.id}
                        name={product.name}
                        slug={product.slug}
                        price={product.price}
                        compareAtPrice={product.compareAtPrice}
                        category={product.category}
                        description={product.description}
                        image={product.images[0] ?? ""}
                    />

                    <ProductPurchase
                        productId={product.id}
                        name={product.name}
                        price={product.price}
                        image={product.images[0] ?? ""}
                        variants={product.variants}
                    />
                </div>
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <section className="mt-24 border-t border-lyra-border pt-16">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-lyra-muted">
                                Curated for you
                            </p>

                            <h2 className="font-display mt-3 text-3xl tracking-tight sm:text-4xl">
                                You may Also Like
                            </h2>
                        </div>
                    </div>

                    <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
                        {relatedProducts.map((relatedProduct) => (
                            <ProductCard
                                key={relatedProduct.id}
                                product={relatedProduct}
                            />
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}