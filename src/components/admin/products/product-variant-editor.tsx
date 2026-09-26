"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

import type { CreateProductInput } from "@/validations/admin-product";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

export function ProductVariantEditor() {
    const { control, register, formState: { errors }, } = useFormContext<CreateProductInput>();
    const { fields, append, remove } = useFieldArray({ control, name: "variants" });

    function addVariant() {
        append({
            size: "",
            stock: 0,
        });
    }

    const variantError = errors.variants?.message;

    return (
        <section className="border border-lyra-border bg-lyra-white">
            <div className="border-b border-lyra-border px-5 py-5 sm:px-6">
                <p className="text-[10px] uppercase tracking-[0.18em] text-lyra-muted">
                    Inventory
                </p>

                <h2 className="mt-1 font-display text-2xl text-lyra-black">
                    Products Variants
                </h2>

                <p className="mt-2 text-sm leading-6 text-lyra-muted">
                    Add available sizes and define the stock quantity for each variant.
                </p>
            </div>

            <div className="p-5 sm:p-6">
                <div className="space-y-3">
                    {fields.map((field, index) => {
                        const sizeError = errors.variants?.[index]?.size?.message;
                        const stockError = errors.variants?.[index]?.stock?.message;

                        return (
                            <div
                                key={field.id}
                                className="grid gap-3 border border-lyra-border p-3 sm:grid-cols-[1fr_1fr_auto] sm:items-start"
                            >
                                {/* Size */}
                                <div>
                                    <label className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-lyra-muted">
                                        Size
                                    </label>

                                    <select
                                        {...register(`variants.${index}.size`)}
                                        className="h-11 w-full border border-lyra-border bg-lyra-cream px-3 text-sm outline-none focus:border-lyra-black"
                                        defaultValue={field.size}
                                    >
                                        <option value="">Select Size</option>

                                        {SIZE_OPTIONS.map((size) => (
                                            <option
                                                key={size}
                                                value={size}
                                            >
                                                {size}
                                            </option>
                                        ))}
                                    </select>

                                    {sizeError && (
                                        <p className="mt-2 text-xs text-red-600">
                                            {sizeError}
                                        </p>
                                    )}
                                </div>

                                {/* Stock */}
                                <div>
                                    <label className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-lyra-muted">
                                        Stock Quantity
                                    </label>

                                    <input
                                        type="number"
                                        min={0}
                                        {...register(`variants.${index}.stock`)}
                                        className="h-11 w-full border border-lyra-border bg-lyra-cream px-3 text-sm outline-none focus:border-lyra-black"
                                        placeholder="0"
                                    />

                                    {stockError && (
                                        <p className="mt-2 text-xs text-red-600">
                                            {stockError}
                                        </p>
                                    )}
                                </div>

                                {/* Remove */}
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    disabled={fields.length === 1}
                                    className="mt-6 inline-flex h-11 w-full items-center justify-center border border-lyra-border px-4 text-4xl text-lyra-muted transition-colors hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 sm:w-11 sm:px-0"
                                    aria-label={`Remove variant ${index + 1}`}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="ml-2 text-[10px] uppercase tracking-widest sm:hidden">
                                        Remove
                                    </span>
                                </button>
                            </div>
                        );
                    })}
                </div>

                <button
                    type="button"
                    onClick={addVariant}
                    className="mt-5 inline-flex h-11 items-center gap-2 border border-lyra-black px-5 text-[10px] uppercase tracking-[0.14em] text-lyra-black transition-colors hover:bg-lyra-black hover:text-lyra-white"
                >
                    <Plus className="h-4 w-4" />
                    Add Size
                </button>
            </div>
        </section>
    );
}