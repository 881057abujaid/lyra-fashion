"use client";

import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import type { UpdateProductFormInput } from "@/validations/admin-product";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

export function ProductVariantEditEditor() {
    const {
        control,
        register,
        formState: { errors },
    } = useFormContext<UpdateProductFormInput>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "variants",
    });

    return (
        <div className="space-y-4">
            {fields.map((field, index) => {
                const variantError = errors.variants?.[index];

                return (
                    <div
                        key={field.id}
                        className="border border-lyra-border bg-lyra-cream p-4"
                    >
                        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                            {/* Size */}
                            <div>
                                <label
                                    htmlFor={`variants-${index}-size`}
                                    className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-lyra-muted"
                                >
                                    Size
                                </label>

                                <select
                                    id={`variants-${index}-size`}
                                    {...register(`variants.${index}.size`)}
                                    className="w-full border border-lyra-border bg-lyra-white px-4 py-3 text-sm transition focus:border-lyra-black focus-visible:outline-2 focus-visible:outline-lyra-black focus-visible:outline-offset-2"
                                >
                                    <option value="">Select size</option>

                                    {SIZE_OPTIONS.map((size) => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>

                                {variantError?.size?.message && (
                                    <p className="mt-1.5 text-xs text-red-600">
                                        {variantError.size.message}
                                    </p>
                                )}
                            </div>

                            {/* Stock */}
                            <div>
                                <label
                                    htmlFor={`variants-${index}-stock`}
                                    className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-lyra-muted"
                                >
                                    Stock
                                </label>

                                <input
                                    id={`variants-${index}-stock`}
                                    type="number"
                                    min="0"
                                    step="1"
                                    {...register(`variants.${index}.stock`, {
                                        valueAsNumber: true,
                                    })}
                                    className="w-full border border-lyra-border bg-lyra-white px-4 py-3 text-sm transition focus:border-lyra-black focus-visible:outline-2 focus-visible:outline-lyra-black focus-visible:outline-offset-2"
                                />

                                {variantError?.stock?.message && (
                                    <p className="mt-1.5 text-xs text-red-600">
                                        {variantError.stock.message}
                                    </p>
                                )}
                            </div>

                            {/* Remove */}
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                disabled={fields.length === 1}
                                className="inline-flex h-11 items-center justify-center gap-2 border border-lyra-border bg-lyra-white px-4 text-sm transition hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="sm:hidden">Remove</span>
                            </button>
                        </div>
                    </div>
                );
            })}

            <button
                type="button"
                onClick={() =>
                    append({
                        id: undefined,
                        size: "",
                        stock: 0,
                    })
                }
                className="inline-flex items-center gap-2 border border-dashed border-lyra-border px-4 py-3 text-sm transition hover:border-lyra-black"
            >
                <Plus className="h-4 w-4" />
                Add Size
            </button>
        </div>
    );
}