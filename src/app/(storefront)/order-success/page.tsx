import Link from "next/link";
import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import { getOrderByNumber } from "@/lib/data/orders";
import { auth } from "@/auth";

type OrderSuccessPageProps = {
    searchParams: Promise<{
        order?: string;
    }>;
};

export default async function OrderSuccessPage({
    searchParams,
}: OrderSuccessPageProps) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const { order: orderNumber } = await searchParams;

    if (!orderNumber) {
        redirect("/shop");
    }

    const order = await getOrderByNumber(
        orderNumber,
        session.user.id
    );

    if (!order) {
        redirect("/shop");
    }

    return (
        <main className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
            {/* Configuration */}
            <section className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-lyra-border">
                    <Check
                        className="h-5 w-5"
                        strokeWidth={1.5}
                    />
                </div>

                <p className="mt-8 text-[10px] uppercase tracking-[0.2em] text-lyra-muted">
                    Order Confirmed
                </p>

                <h1 className="font-display mt-3 text-4xl tracking-tight sm:text-5xl">
                    Thank you for shipping with LYRA.
                </h1>

                <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-lyra-muted">
                    Your order has been received and will be processed shortly.
                </p>

                <p className="mt-6 text-xs uppercase tracking-[0.16em]">
                    Order {order.orderNumber}
                </p>
            </section>

            {/* Order Details */}
            <section className="mt-16 border-y border-lyra-border py-10">
                <div className="grid gap-10 md:grid-cols-3">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-lyra-muted">
                            Order Status
                        </p>

                        <p className="mt-3 text-sm capitalize">
                            {order.status.toLowerCase()}
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-lyra-muted">
                            Payment
                        </p>

                        <p className="mt-3 text-sm capitalize">
                            {order.paymentStatus.toLowerCase()}
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-lyra-muted">
                            Total
                        </p>

                        <p className="mt-3 font-display text-xl">
                            ₹{order.total.toLocaleString("en-IN")}
                        </p>
                    </div>
                </div>
            </section>

            {/* Items */}
            <section className="mt-16">
                <p className="text-[10px] uppercase tracking-[0.2em] text-lyra-muted">
                    Order Summary
                </p>

                <div className="mt-6 divide-y divide-lyra-border border-y border-lyra-border">
                    {order.items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between gap-6 py-6"
                        >
                            <div>
                                <p className="text-sm">
                                    {item.productName}
                                </p>

                                <p className="mt-1 text-xs text-lyra-muted">
                                    {item.size} • {item.quantity}
                                </p>
                            </div>

                            <p className="shrink-0 text-sm">
                                ₹{(item.productPrice * item.quantity).toLocaleString("en-IN")}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="ml-auto mt-8 max-w-sm space-y-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-lyra-muted">
                            Subtotal
                        </span>

                        <span>
                            ₹{order.subtotal.toLocaleString("en-IN")}
                        </span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="tetx-lyra-muted">
                            Shipping
                        </span>

                        <span>
                            {order.shipping === 0
                                ? "Free" : `₹${order.shipping.toLocaleString("en-IN")}`}
                        </span>
                    </div>

                    <div className="border-t border-lyra-border pt-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs uppercase tracking-[0.16em]">
                                Total
                            </span>

                            <span className="font-display text-2xl">
                                ₹{order.total.toLocaleString("en-IN")}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Actions */}
            <section className="mt-16 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link
                    href="/shop"
                    className="bg-lyra-black px-8 py-4 text-center text-xs uppercase tracking-[0.18em] text-lyra-white transition-opacity hover:opacity-80"
                >
                    Continue Shopping
                </Link>

                <Link
                    href="/account"
                    className="border border-lyra-border px-8 py-4 text-center text-xs uppercase tracking-[0.18em] transition-colors hover:border-lyra-black"
                >
                    View Account
                </Link>
            </section>
        </main>
    );
}