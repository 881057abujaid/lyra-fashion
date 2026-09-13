import { notFound } from "next/navigation";

import { ProductGallery } from "@/components/product/product-gallery";
import { getProductBySlug } from "@/lib/data/products";
import { ProductPurchase } from "@/components/product/product-purchase";
import { ProductInfo } from "@/components/product/product-info";

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
        </main>
    );
}