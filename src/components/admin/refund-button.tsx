"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { refundOrderAction } from "@/lib/actions/admin.actions";

type RefundButtonProps = {
    orderId: string;
    amount: number;
};

export function RefundButton({
    orderId,
    amount,
}: RefundButtonProps) {
    const router = useRouter();

    const [isRefunding, setIsRefunding] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleRefund() {
        const confirmed = window.confirm(
            `Are you sure you want to refund ₹${amount.toLocaleString("en-IN")} to the customer?`
        );

        if (!confirmed) return;

        setIsRefunding(true);
        setError(null);

        try {
            await refundOrderAction(orderId);
            router.refresh();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to process refund"
            );
        } finally {
            setIsRefunding(false);
        }
    }

    return (
        <div>
            <button
                type="button"
                onClick={handleRefund}
                disabled={isRefunding}
                className="border border-red-600 px-4 py-2 text-xs uppercase tracking-[0.14em] text-red-600 transition-colors hover:bg-red-600 hover:text-lyra-white disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isRefunding ? "Processing Refund..." : "Refund Payment"}
            </button>

            {error && (
                <p className="mt-3 text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}