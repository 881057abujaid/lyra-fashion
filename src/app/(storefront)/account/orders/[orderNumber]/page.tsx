import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import { getOrderByNumber } from "@/lib/data/orders";

type OrderDetailsPageProps = {
    params: Promise<{
        orderNumber: string;
    }>;
};

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const { orderNumber } = await params;

    const order = await getOrderByNumber(orderNumber, session.user.id);

    if (!order) {
        redirect("/account/orders");
    }

    return (
        <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            {/* Header */}
            <section className="border-b border-lyra-border pb-10">
                <Link
                    href="/account/orders"
                    className="text-[10px] uppercase tracking-[0.18em] text-lyra-muted transition-colors hover:text-lyra-black"
                >
                    <ArrowLeft className="mr-2 inline-block h-3 w-3" />
                    Back to orders
                </Link>
                <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-lyra-muted">
                            Order
                        </p>

                        <h1 className="font-display mt-3 text-4xl tracking-tight sm:text-5xl">
                            {order.orderNumber}
                        </h1>

                        <p className="mt-4 text-sm text-lyra-muted">
                            Placed on{" "}
                            {order.createdAt.toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                    </div>

                    <div className="flex gap-10">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.16em] text-lyra-muted">
                                Status
                            </p>

                            <p className="mt-2 text-sm capitalize">
                                {order.status.toLowerCase()}
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] uppercase tracking-[0.16em] text-lyra-muted">
                                Payment
                            </p>

                            <p className="mt-2 text-sm capitalize">
                                {order.paymentStatus.toLowerCase()}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="mt-14 grid gap-16 lg:grid-cols-[1fr_360px]">
                {/* Items */}
                <section>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-lyra-muted">
                        Order Items
                    </p>

                    <div className="mt-6 divide-y divide-lyra-border border-y border-lyra-border">
                        {order.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-5 py-7"
                            >
                                <div className="flex-1">
                                    <p className="text-sm">
                                        {item.productName}
                                    </p>

                                    <p className="mt-2 text-xs text-lyra-muted">
                                        Size {item.size} • Qty{" "}
                                        {item.quantity}
                                    </p>
                                </div>

                                <p className="shrink-0 text-sm">
                                    ₹{(item.productPrice * item.quantity).toLocaleString("en-IN")}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Summary */}
                <aside>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-lyra-muted">
                        Order Summary
                    </p>

                    <div className="mt-6 space-y-5 border-y border-lyra-border py-6">
                        <div className="flex justify-between tetx-sm">
                            <span className="text-lyra-muted">
                                Subtotal
                            </span>

                            <span>
                                ₹{order.subtotal.toLocaleString("en-IN")}
                            </span>
                        </div>

                        <div className="border-t border-lyra-border pt-5">
                            <div className="flex justify-between text-sm">
                                <span className="text-lyra-muted">
                                    Shipping
                                </span>

                                <span>
                                    {order.shipping === 0 ? "Free" : `₹${order.shipping.toLocaleString("en-IN")}`}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="mt-12">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-lyra-muted">
                            Shipping Address
                        </p>

                        <div className="mt-6 text-sm leading-7">
                            <p>{order.customerName}</p>

                            <p className="mt-2 text-lyra-muted">
                                {order.shippingAddress}
                                <br />
                                {order.shippingCity},{" "}
                                {order.shippingState}
                                <br />
                                {order.shippingPincode}
                            </p>

                            <p className="mt-4 text-lyra-muted">
                                {order.customerPhone}
                                <br />
                                {order.customerEmail}
                            </p>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Footer Action */}
            <div className="mt-16 border-t border-lyra-border pt-8">
                <Link
                    href="/shop"
                    className="inline-block bg-lyra-black px-8 py-4 text-xs uppercase tracking-[0.18em] text-lyra-white transition-opacity hover:opacity-80"
                >
                    Continue Shopping
                </Link>
            </div>
        </main>
    );
}