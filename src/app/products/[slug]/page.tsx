import { notFound } from "next/navigation";

import { ProductGallery } from "@/components/product/product-gallery";
import { getProductBySlug } from "@/lib/data/products";
import { ProductPurchase } from "@/components/product/product-purchase";

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

    return (
        <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-16">
            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
                <ProductGallery
                    images={product.images}
                    name={product.name}
                />

                <div className="lg:sticky lg:top-28 lg:self-start">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-lyra-muted">
                        {product.category}
                    </p>

                    <h1 className="font-display mt-4 text-4xl tracking-tight sm:text-5xl">
                        {product.name}
                    </h1>

                    <div className="mt-5 flex items-center gap-3">
                        <span className="text-base">
                            ₹{product.price.toLocaleString("en-IN")}
                        </span>

                        {product.compareAtPrice && (
                            <span className="text-sm text-lyra-subtle line-through">
                                ₹
                                {product.compareAtPrice.toLocaleString(
                                    "en-IN"
                                )}
                            </span>
                        )}
                    </div>

                    <div className="mt-8 border-t border-lyra-border pt-8">
                        <p className="max-w-xl text-sm leading-7 text-lyra-muted">
                            {product.description}
                        </p>
                    </div>

                    <ProductPurchase
                        productId={product.id}
                        name={product.name}
                        price={product.price}
                        image={product.images[0] ?? ""}
                        variants={product.variants}
                    />
                </div>
            </div>
        </main>
    );
}