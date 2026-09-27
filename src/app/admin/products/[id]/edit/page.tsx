import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getAdminProductById } from "@/lib/data/admin-products";
import { ProductEditForm } from "@/components/admin/products/product-edit-form";

type EditProductPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditProductPage({
    params,
}: EditProductPageProps) {
    const { id } = await params;

    const product = await getAdminProductById(id);

    if (!product) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-6">
                <div className="text-center">
                    <p className="text-xs uppercase tracking-[0.25em] text-lyra-muted">
                        Product not found
                    </p>

                    <h1 className="mt-3 font-display text-3xl">
                        This product doesn&apos;t exist.
                    </h1>

                    <Link
                        href="/admin/products"
                        className="mt-6 inline-flex items-center gap-2 text-sm underline underline-offset-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl space-y-8">
            {/* Header */}
            <div>
                <Link
                    href="/admin/products"
                    className="inline-flex items-center gap-2 text-sm text-lyra-muted transition-colors hover:text-lyra-black"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to products
                </Link>

                <div className="mt-5">
                    <p className="text-xs uppercase tracking-[0.25em] text-lyra-muted">
                        Product Management
                    </p>

                    <h1 className="mt-2 font-display text-3xl sm:text-4xl">
                        Edit Product
                    </h1>

                    <p className="mt-2 text-sm text-lyra-muted">
                        Update product details, pricing, storefront settings and inventory.
                    </p>
                </div>
            </div>

            {/* Product */}
            <ProductEditForm product={product} />
        </div>
    );
}