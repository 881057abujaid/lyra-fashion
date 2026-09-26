"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
    CreateProductSchema,
    type CreateProductInput
} from "@/validations/admin-product";
import { createAdminProduct } from "@/lib/actions/admin-product.actions";
import { ProductVariantEditor } from "./product-variant-editor";

const inputClassName = "w-full border-b border-lyra-border bg-transparent px-0 py-3 text-sm outline-none transition-colors placeholder:text-lyra-subtle focus:border-lyra-black";

type FieldProps = {
    label: string;
    error?: string;
    children: React.ReactNode;
};

function Field({ label, error, children }: FieldProps) {
    return (
        <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-lyra-muted">
                {label}
            </label>

            {children}

            {error && (
                <p className="mt-2 text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

export function ProductForm() {
    const router = useRouter();

    const [serverError, setServerError] = useState<string | null>(null);

    const methods = useForm<CreateProductInput>({
        resolver: zodResolver(CreateProductSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            compareAtPrice: null,
            sku: "",
            category: "",
            isFeatured: false,
            isNewArrival: false,
            variants: [
                {
                    size: "",
                    stock: 0,
                },
            ],
        },
    });

    const { register, handleSubmit, formState: { errors, isSubmitting }, } = methods;

    async function onSubmit(data: CreateProductInput) {
        setServerError(null);

        try {
            await createAdminProduct(data);

            router.push("/admin/products");
            router.refresh();
        } catch (error) {
            console.error("Failed to create product: ", error);
            setServerError(error instanceof Error ? error.message : "Unable to create product");
        }
    }

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="space-y-6"
            >
                {/* Basic Information */}
                <section className="border border-lyra-border bg-lyra-white">
                    <div className="border-b border-lyra-border px-5 py-5 sm:px-6">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-lyra-muted">
                            Product
                        </p>

                        <h2 className="mt-1 font-display text-2xl text-lyra-black">
                            Basic Information
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-lyra-muted">
                            Add the essential information for your LYRA product.
                        </p>
                    </div>

                    <div className="grid gap-7 p-5 sm:p-6 lg:grid-cols-2">
                        {/* Name */}
                        <Field
                            label="Product Name"
                            error={errors.name?.message}
                        >
                            <input
                                {...register("name")}
                                placeholder="e.g. Structured Everyday Blazer"
                                className={inputClassName}
                            />
                        </Field>

                        {/* SKU */}
                        <Field
                            label="SKU"
                            error={errors.sku?.message}
                        >
                            <input
                                {...register("sku")}
                                placeholder="e.g. Blazers"
                                className={inputClassName}
                            />
                        </Field>

                        {/* Category */}
                        <Field
                            label="Category"
                            error={errors.category?.message}
                        >
                            <input
                                {...register("category")}
                                placeholder="e.g. Blazers"
                                className={inputClassName}
                            />
                        </Field>

                        {/* Description */}
                        <div className="lg:col-span-2">
                            <Field
                                label="Description"
                                error={errors.description?.message}
                            >
                                <textarea
                                    {...register("description")}
                                    rows={5}
                                    placeholder="Describe the product..."
                                    className="w-full resize-none border border-lyra-border bg-transparent px-4 py-3 text-sm outline-none transition-colors placeholder:text-lyra-subtle focus:border-lyra-black"
                                />
                            </Field>
                        </div>
                    </div>
                </section>

                {/* Pricing */}
                <section className="border border-lyra-border bg-lyra-white">
                    <div className="border-b border-lyra-border px-5 py-5 sm:px-6">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-lyra-muted">
                            Pricing
                        </p>

                        <h2 className="mt-1 font-display text-2xl text-lyra-black">
                            Product Pricing
                        </h2>
                    </div>

                    <div className="grid gap-7 p-5 sm:p-6 sm:grid-cols-1-2">
                        {/* Price */}
                        <Field
                            label="Selling Price (₹)"
                            error={errors.price?.message}
                        >
                            <input
                                type="number"
                                min={1}
                                {...register("price", { valueAsNumber: true })}
                                placeholder="1799"
                                className={inputClassName}
                            />
                        </Field>

                        {/* Compare at */}
                        <Field
                            label="Compare-at Price (₹)"
                            error={errors.compareAtPrice?.message}
                        >
                            <input
                                type="number"
                                min={1}
                                {...register("compareAtPrice", { setValueAs: (value) => value === "" ? null : Number(value) })}
                                placeholder="2299"
                                className={inputClassName}
                            />
                        </Field>
                    </div>
                </section>

                {/* Storefront settings */}
                <section className="border border-lyra-border bg-lyra-white">
                    <div className="border-b border-lyra-border px-5 py-5 sm:px-6">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-lyra-muted">
                            Visibility
                        </p>

                        <h2 className="mt-1 font-display text-2xl text-lyra-black">
                            Storefront Settings
                        </h2>
                    </div>

                    <div className="grid gap-4 p-5 sm:p-6 sm:grid-cols-2">
                        <label className="flex cursor-pointer items-start gap-3 border border-lyra-border p-4 transition-colors hover:border-lyra-black">
                            <input
                                type="checkbox"
                                {...register("isFeatured")}
                                className="mt-0.5 h-4 w-4 accent-black"
                            />

                            <span>
                                <span className="block text-sm text-lyra-black">
                                    Featured Product
                                </span>

                                <span className="mt-1 block text-xs leading-5 text-lyra-muted">
                                    Show this product in featured product secions.
                                </span>
                            </span>
                        </label>

                        <label className="flex cursor-pointer items-start gap-3 border border-lyra-border p-4 transition-colors hover:border-lyra-black">
                            <input
                                type="checkbox"
                                {...register("isNewArrival")}
                                className="mt-0.5 h-4 w-4 accent-black"
                            />

                            <span>
                                <span className="block text-sm text-lyra-black">
                                    New Arrival
                                </span>

                                <span className="mt-1 block text-xs leading-5 text-lyra-muted">
                                    Mark this product as a new arrival.
                                </span>
                            </span>
                        </label>
                    </div>
                </section>

                {/* Variants */}
                <ProductVariantEditor />

                {/* Server error */}
                {serverError && (
                    <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {serverError}
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col-reverse gap-3 border-t border-lyra-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                        href="/admin/products"
                        className="inline-flex h-11 items-center justify-center gap-2 border border-lyra-border px-5 text-[10px] uppercase tracking-[0.14em] text-lyra-black transition-colors hover:border-lyra-black"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex h-11 items-center justify-center gap-2 bg-lyra-black px-6 text-[10px] uppercase tracking-[0.16em] text-lyra-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        {isSubmitting ? "Creating Product..." : "Create Product"}
                    </button>
                </div>
            </form>
        </FormProvider>
    );
}