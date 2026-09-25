import Link from "next/link";
import { ArrowLeft, Section } from "lucide-react";
import { notFound } from "next/navigation";

import { getAdminOrderById } from "@/lib/data/admin";
import { OrderStatusControl } from "@/components/admin/order-status-control";

type AdminOrderDetailPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function AdminOrderDetailPage({
    params,
}: AdminOrderDetailPageProps) {
    const { id } = await params;

    const order = await getAdminOrderById(id);

    if (!order) {
        notFound();
    }

    return (
        <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
            {/* Back */}
            <Link
                href="/admin/orders"
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-lyra-muted transition-colors hover:text-lyra-black"
            >
                <ArrowLeft
                    size={14}
                    strokeWidth={1.5}
                />
                Back to Orders
            </Link>

            {/* Header */}
            <div className="mt-8 border-b border-lyra-border pb-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-lyra-muted">
                            Order
                        </p>

                        <h1 className="mt-3 font-display text-3xl tracking-tight lg:text-5xl">
                            {order.orderNumber}
                        </h1>

                        <p className="mt-3 text-xs text-lyra-muted">
                            {formatOrderDateTime(
                                order.createdAt
                            )}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <StatusBadge
                            value={order.paymentStatus}
                        />

                        <StatusBadge
                            value={order.status}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
                <div className="space-y-8">
                    {/* Customer */}
                    <section className="border border-lyra-border bg-lyra-white">
                        <SectionHeader title="Customer Information" />

                        <div className="grid gap-6 p-6 ms:grid-cols-3">
                            <Info
                                label="Name"
                                value={order.customerName}
                            />

                            <Info
                                label="Email"
                                value={order.customerEmail}
                            />

                            <Info
                                label="Phone"
                                value={order.customerPhone}
                            />
                        </div>
                    </section>

                    {/* Shipping */}
                    <section className="border border-lyra-border bg-lyra-white">
                        <SectionHeader title="Shipping Address" />

                        <div className="p-6">
                            <p className="text-sm leading-6">
                                {order.shippingAddress}
                            </p>

                            <p className="mt-1 text-sm text-lyra-muted">
                                {order.shippingCity},{" "}
                                {order.shippingState}
                            </p>

                            <p className="mt-1 text-sm text-lyra-muted">
                                {order.shippingPincode}
                            </p>
                        </div>
                    </section>

                    {/* Items */}
                    <section className="border border-lyra-border bg-lyra-white">
                        <SectionHeader title="Order Items" />

                        <div>
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-4 border-b border-lyra-border p-5 last:border-b-0 sm:p-6"
                                >
                                    {/* Product Image */}
                                    <div className="h-20 w-16 shrink-0 overflow-hidden bg-lyra-beige">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.productName}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-[9px] uppercase tracking-wider text-lyra-subtle">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm">
                                            {item.productName}
                                        </p>

                                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-lyra-muted">
                                            <span>Size: {item.size}</span>
                                            <span>Qty:{" "}{item.quantity}</span>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="shrink-0 text-right">
                                        <p className="text-sm">
                                            ₹{(item.productPrice * item.quantity).toLocaleString("en-IN")}
                                        </p>
                                        <p className="mt-1 text-[10px] text-lyra-muted">
                                            {item.productPrice.toLocaleString("en-IN")}{" "}each
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Payment */}
                    <section className="border border-lyra-border bg-lyra-white">
                        <SectionHeader title="Payment Information" />

                        <div className="grid gap-6 p-6 sm:grid-cols-2">
                            <Info
                                label="Payment Status"
                                value={order.paymentStatus}
                            />

                            <Info
                                label="Order Status"
                                value={order.status}
                            />

                            <Info
                                label="Razorpay Order ID"
                                value={order.razorpayOrderId ?? "Not created"}
                            />
                        </div>

                        <OrderStatusControl
                            orderId={order.id}
                            currentStatus={order.status}
                            paymentStatus={order.paymentStatus}
                        />
                    </section>
                </div>

                {/* Summary */}
                <aside className="h-fit border border-lyra-border bg-lyra-white lg:sticky lg:top-8">
                    <SectionHeader title="Order Summary" />

                    <div className="space-y-4 p-6">
                        <SummaryRow
                            label="Subtotal"
                            value={order.subtotal}
                        />

                        <SummaryRow
                            label="Shipping"
                            value={order.shipping}
                        />

                        <div className="border-t border-lyra-border pt-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs uppercase tracking-[0.12em]">
                                    Total
                                </span>

                                <span className="font-display text-2xl">
                                    ₹{order.total.toLocaleString("en-IN")}
                                </span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

function SectionHeader({ title, }: { title: string; }) {
    return (
        <div className="border-b border-lyra-border px-6 py-5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-lyra-muted">
                {title}
            </p>
        </div>
    );
}

function Info({ label, value }: {
    label: string;
    value: string;
}) {
    return (
        <div>
            <p className="text-[9px] uppercase tracking-[0.14em] text-lyra-subtle">
                {label}
            </p>

            <p className="mt-2 wrap-break-words text-sm">
                {value}
            </p>
        </div>
    );
}

function SummaryRow({ label, value }: {
    label: string;
    value: number;
}) {
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="text-lyra-muted">
                {label}
            </span>

            <span>
                ₹{value.toLocaleString("en-IN")}
            </span>
        </div>
    );
}

function StatusBadge({ value }: { value: string; }) {
    return (
        <span className="inline-flex border border-lyra-border px-3 py-1.5 text-[9px] uppercase tracking-[0.13em] text-lyra-muted">
            {value}
        </span>
    );
}

function formatOrderDateTime(date: Date) {
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}