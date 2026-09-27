"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { ArrowLeft, Loader2, Save } from "lucide-react";

import {
    UpdateProductSchema,
    type UpdateProductFormInput,
    type UpdateProductInput,
} from "@/validations/admin-product";
import { updateAdminProduct } from "@/lib/actions/admin-product.actions";

import { ProductVariantEditEditor } from "./product-variant-edit-editor";

type ProductEditFormProduct = {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    compareAtPrice: number | null;
    sku: string;
    category: string;
    images: {
        id: string;
        url: string;
        publicId: string;
        alt: string | null;
        sortOrder: number;
    }[];
    isFeatured: boolean;
    isNewArrival: boolean;
    variants: {
        id: string;
        size: string;
        stock: number;
    }[];
};

type ProductEditFormProps = {
    product: ProductEditFormProduct;
};

export function ProductEditForm({
    product,
}: ProductEditFormProps) {
    const router = useRouter();

    const [serverError, setServerError] = useState<string | null>(
        null,
    );

    const methods = useForm<
        UpdateProductFormInput,
        unknown,
        UpdateProductInput
    >({
        resolver: zodResolver(UpdateProductSchema),

        defaultValues: {
            name: product.name,
            description: product.description,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            sku: product.sku,
            category: product.category,
            isFeatured: product.isFeatured,
            isNewArrival: product.isNewArrival,

            variants: product.variants.map((variant) => ({
                id: variant.id,
                size: variant.size,
                stock: variant.stock,
            })),
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = methods;

    async function onSubmit(data: UpdateProductInput) {
        setServerError(null);

        try {
            await updateAdminProduct(product.id, data);

            router.push("/admin/products");
            router.refresh();
        } catch (error) {
            setServerError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong while updating the product.",
            );
        }
    }

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 pb-12"
            >
                {/* Basic Information */}
                <section className="border border-lyra-border bg-lyra-white">
                    <div className="border-b border-lyra-border px-5 py-5 sm:px-6">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-lyra-muted">
                            01
                        </p>

                        <h2 className="mt-1 font-display text-xl">
                            Basic Information
                        </h2>

                        <p className="mt-1 text-sm text-lyra-muted">
                            Update the core information of your product.
                        </p>
                    </div>

                    <div className="space-y-5 p-5 sm:p-6">
                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium"
                            >
                                Product Name
                            </label>

                            <input
                                id="name"
                                {...register("name")}
                                placeholder="e.g. Luna Linen Dress"
                                className="w-full border border-lyra-border bg-lyra-cream px-4 py-3 text-sm outline-none transition focus:border-lyra-black"
                            />

                            {errors.name && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label
                                htmlFor="description"
                                className="mb-2 block text-sm font-medium"
                            >
                                Description
                            </label>

                            <textarea
                                id="description"
                                {...register("description")}
                                rows={5}
                                placeholder="Describe the product..."
                                className="w-full resize-none border border-lyra-border bg-lyra-cream px-4 py-3 text-sm outline-none transition focus:border-lyra-black"
                            />

                            {errors.description && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Pricing & Catalog */}
                <section className="border border-lyra-border bg-lyra-white">
                    <div className="border-b border-lyra-border px-5 py-5 sm:px-6">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-lyra-muted">
                            02
                        </p>

                        <h2 className="mt-1 font-display text-xl">
                            Pricing & Catalog
                        </h2>

                        <p className="mt-1 text-sm text-lyra-muted">
                            Manage pricing, SKU and product classification.
                        </p>
                    </div>

                    <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
                        {/* Price */}
                        <div>
                            <label
                                htmlFor="price"
                                className="mb-2 block text-sm font-medium"
                            >
                                Selling Price
                            </label>

                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-lyra-muted">
                                    ₹
                                </span>

                                <input
                                    id="price"
                                    type="number"
                                    min="1"
                                    step="1"
                                    {...register("price", {
                                        valueAsNumber: true,
                                    })}
                                    className="w-full border border-lyra-border bg-lyra-cream py-3 pl-9 pr-4 text-sm outline-none transition focus:border-lyra-black"
                                />
                            </div>

                            {errors.price && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {errors.price.message}
                                </p>
                            )}
                        </div>

                        {/* Compare At Price */}
                        <div>
                            <label
                                htmlFor="compareAtPrice"
                                className="mb-2 block text-sm font-medium"
                            >
                                Compare-at Price
                                <span className="ml-1 text-xs font-normal text-lyra-muted">
                                    Optional
                                </span>
                            </label>

                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-lyra-muted">
                                    ₹
                                </span>

                                <input
                                    id="compareAtPrice"
                                    type="number"
                                    min="1"
                                    step="1"
                                    {...register("compareAtPrice", {
                                        setValueAs: (value) =>
                                            value === "" ? null : Number(value),
                                    })}
                                    className="w-full border border-lyra-border bg-lyra-cream py-3 pl-9 pr-4 text-sm outline-none transition focus:border-lyra-black"
                                />
                            </div>

                            {errors.compareAtPrice && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {errors.compareAtPrice.message}
                                </p>
                            )}
                        </div>

                        {/* SKU */}
                        <div>
                            <label
                                htmlFor="sku"
                                className="mb-2 block text-sm font-medium"
                            >
                                SKU
                            </label>

                            <input
                                id="sku"
                                {...register("sku")}
                                placeholder="LYRA-LLD-001"
                                className="w-full border border-lyra-border bg-lyra-cream px-4 py-3 text-sm uppercase outline-none transition focus:border-lyra-black"
                            />

                            {errors.sku && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {errors.sku.message}
                                </p>
                            )}
                        </div>

                        {/* Category */}
                        <div>
                            <label
                                htmlFor="category"
                                className="mb-2 block text-sm font-medium"
                            >
                                Category
                            </label>

                            <input
                                id="category"
                                {...register("category")}
                                placeholder="Dresses"
                                className="w-full border border-lyra-border bg-lyra-cream px-4 py-3 text-sm outline-none transition focus:border-lyra-black"
                            />

                            {errors.category && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {errors.category.message}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Storefront Settings */}
                <section className="border border-lyra-border bg-lyra-white">
                    <div className="border-b border-lyra-border px-5 py-5 sm:px-6">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-lyra-muted">
                            03
                        </p>

                        <h2 className="mt-1 font-display text-xl">
                            Storefront Settings
                        </h2>
                    </div>

                    <div className="space-y-4 p-5 sm:p-6">
                        <label className="flex cursor-pointer items-start gap-3">
                            <input
                                type="checkbox"
                                {...register("isFeatured")}
                                className="mt-1 h-4 w-4 accent-black"
                            />

                            <span>
                                <span className="block text-sm font-medium">
                                    Featured Product
                                </span>

                                <span className="mt-0.5 block text-xs text-lyra-muted">
                                    Display this product in featured sections.
                                </span>
                            </span>
                        </label>

                        <label className="flex cursor-pointer items-start gap-3">
                            <input
                                type="checkbox"
                                {...register("isNewArrival")}
                                className="mt-1 h-4 w-4 accent-black"
                            />

                            <span>
                                <span className="block text-sm font-medium">
                                    New Arrival
                                </span>

                                <span className="mt-0.5 block text-xs text-lyra-muted">
                                    Mark this product as a new arrival.
                                </span>
                            </span>
                        </label>
                    </div>
                </section>

                {/* Variants */}
                <section className="border border-lyra-border bg-lyra-white">
                    <div className="border-b border-lyra-border px-5 py-5 sm:px-6">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-lyra-muted">
                            04
                        </p>

                        <h2 className="mt-1 font-display text-xl">
                            Size & Inventory
                        </h2>

                        <p className="mt-1 text-sm text-lyra-muted">
                            Update sizes and current stock levels.
                        </p>
                    </div>

                    <div className="p-5 sm:p-6">
                        <ProductVariantEditEditor />
                    </div>
                </section>

                {/* Server Error */}
                {serverError && (
                    <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {serverError}
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={() => router.push("/admin/products")}
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 border border-lyra-border bg-lyra-white px-6 py-3 text-sm transition hover:border-lyra-black disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 bg-lyra-black px-6 py-3 text-sm text-lyra-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Saving Changes...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </FormProvider>
    );
}