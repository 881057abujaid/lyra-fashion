import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ProductForm } from "@/components/admin/products/product-form";

export default function NewProductPage() {
    return (
        <div className="px-5 py-8 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <Link
                        href="/admin/products"
                        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-lyra-muted transition-colors hover:text-lyra-black"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to Products
                    </Link>

                    <p className="mt-7 text-[10px] uppercase tracking-[0.2em] text-lyra-muted">
                        Catalog
                    </p>

                    <h1 className="mt-2 font-display text-3xl text-lyra-black sm:text-4xl">
                        Add Product
                    </h1>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-lyra-muted">
                        Create a new product and configure its available sizes and inventory.
                    </p>
                </div>

                <ProductForm />
            </div>
        </div>
    );
}