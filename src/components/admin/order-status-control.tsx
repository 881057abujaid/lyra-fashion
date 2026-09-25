"use client";

import { useState } from "react";
import { updateAdminOrderStatusAction } from "@/lib/actions/admin.actions";
import { format } from "path";

type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

type OrderStatusControlProps = {
    orderId: string;
    currentStatus: OrderStatus;
    paymentStatus: string;
};

const transitions: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PROCESSING"],
    PROCESSING: ["SHIPPED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
};

export function OrderStatusControl({
    orderId,
    currentStatus,
    paymentStatus,
}: OrderStatusControlProps) {
    const [status, setStatus] = useState<OrderStatus>(currentStatus);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const availableStatuses = transitions[currentStatus];

    async function handleStatusChange(nextStatus: OrderStatus) {
        if (nextStatus === currentStatus) return;

        setIsUpdating(true);
        setError(null);

        try {
            await updateAdminOrderStatusAction(orderId, nextStatus);
            setStatus(nextStatus);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Unable to update order status");
        } finally {
            setIsUpdating(false);
        }
    }

    if (availableStatuses.length === 0) {
        return (
            <div className="border border-lyra-border bg-lyra-white p-6">
                <p className="text-[9px] uppercase tracking-[0.14em] text-lyra-subtle">
                    Order Status
                </p>

                <p className="mt-2 text-sm">
                    {status}
                </p>
            </div>
        );
    }

    const canCancel = currentStatus === "PENDING" && paymentStatus === "PENDING";

    return (
        <div className="border border-lyra-border bg-lyra-white p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[9px] uppercase tracking-[0.14em] text-lyra-subtle">
                        Order Status
                    </p>

                    <p className="mt-2 text-sm">
                        {status}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {availableStatuses.map((nextStatus) => {
                        if (nextStatus === "CANCELLED" && !canCancel) return null;

                        return (
                            <button
                                key={nextStatus}
                                type="button"
                                disabled={isUpdating}
                                onClick={() => handleStatusChange(nextStatus)}
                                className="border border-lyra-black px-4 py-2 text-[9px] uppercase tracking-[0.14em] transition-colors hover:bg-lyra-black hover:text-lyra-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isUpdating ? "Updating..." : `Mark ${formatStatus(nextStatus)}`}
                            </button>
                        );
                    })}
                </div>
            </div>

            {currentStatus === "PENDING" &&
                paymentStatus !== "PENDING" && (
                    <p className="mt-4 border-t border-lyra-border pt-4 text-[11px] leading-5 text-lyra-muted">
                        This order has already been
                        paid. Cancellation is disabled
                        until refund support is
                        available.
                    </p>
                )}

            {error && (
                <p className="mt-4 border-t border-red-200 pt-4 text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

function formatStatus(status: OrderStatus) {
    return status
        .toLowerCase()
        .replace("_", " ");
}