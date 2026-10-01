"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { updateInventoryStockAction } from "@/lib/actions/admin-inventory.action";

type StockAdjustmentModalProps = {
    variantId: string;
    productName: string;
    size: string;
    currentStock: number;
    onClose: () => void;
};

export function StockAdjustmentModal({
    variantId,
    productName,
    size,
    currentStock,
    onClose,
}: StockAdjustmentModalProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [stock, setStock] = useState(String(currentStock));
    const [error, setError] = useState("");

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        const newStock = Number(stock);

        if (!Number.isInteger(newStock) || newStock < 0) {
            setError("Stock must be a whole number greater than or equal to 0.");
            return;
        }

        startTransition(async () => {
            try {
                await updateInventoryStockAction({
                    variantId,
                    stock: newStock,
                });

                router.refresh();
                onClose();
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to update stock.",
                );
            }
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md bg-white p-6 shadow-xl">
                <div className="mb-6">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                        Inventory
                    </p>

                    <h2 className="mt-2 font-serif text-2xl text-neutral-900">
                        Update Stock
                    </h2>
                </div>

                <div className="mb-6 space-y-2 rounded-xl bg-neutral-50 p-4 text-sm">
                    <div className="flex justify-between gap-4">
                        <span className="text-neutral-500">Product</span>
                        <span className="text-right font-medium text-neutral-900">
                            {productName}
                        </span>
                    </div>

                    <div className="flex justify-between gap-4">
                        <span className="text-neutral-500">Size</span>
                        <span className="font-medium text-neutral-900">
                            {size}
                        </span>
                    </div>

                    <div className="flex justify-between gap-4">
                        <span className="text-neutral-500">Current Stock</span>
                        <span className="font-medium text-neutral-900">
                            {currentStock}
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="stock"
                            className="mb-2 block text-sm font-medium text-neutral-900"
                        >
                            New Stock
                        </label>

                        <input
                            id="stock"
                            type="number"
                            min="0"
                            step="1"
                            value={stock}
                            onChange={(event) => setStock(event.target.value)}
                            disabled={isPending}
                            className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-900"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isPending}
                            className="border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isPending ? "Updating..." : "Update Stock"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}