import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserOrders } from "@/lib/data/order";

export default async function OrderPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const orders = await getUserOrders(session.user.id);

    return (
        <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <div className="border-b border-lyra-border pb-8">
                <p className="text-[10px] uppercase tracking-[0.2em] text-lyra-muted">
                    My Account
                </p>

                <h1 className="font-display mt-3 text-4xl tracking-tight sm:text-5xl">
                    Your Orders
                </h1>

                <p className="mt-4 text-sm text-lyra-muted">
                    View your order history and track your purchases.
                </p>
            </div>

            {orders.length === 0 ? (
                <div className="py-24 text-center">
                    <p className="font-display text-3xl">
                        No orders yet.
                    </p>

                    <p className="mx-auto mt-4 max-w-sm leading-6 text-lyra-muted">
                        Your orders will appear here once you complete your first purchase.
                    </p>

                    <Link
                        href="/shop"
                        className="mt-8 inline-block bg-lyra-black px-8 py-4 text-xs uppercase tracking-[0.18em] text-lyra-white transition-opacity hover:opacity-80"
                    >
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="mt-12 space-y-6">
                    {orders.map((order) => (
                        <Link
                            key={order.id}
                            href={`/account/orders/${order.orderNumber}`}
                            className="block border border-lyra-border bg-lyra-white p-6 transition-colors hover:border-lyra-black sm:p-8"
                        >
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.16em] text-lyra-muted">
                                        Order
                                    </p>

                                    <p className="mt-2 text-sm">
                                        {order.orderNumber}
                                    </p>

                                    <p className="mt-2 text-xs text-lyra-muted">
                                        {order.createdAt.toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric"
                                        })}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 sm:flex sm:items-center sm:gap-12">
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
                                            Total
                                        </p>

                                        <p className="mt-2 font-display text-xl">
                                            ₹{order.total.toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 border-t border-lyra-border pt-6">
                                <p className="text-xs text-lyra-muted">
                                    {order.items.length}{" "}
                                    {order.items.length === 1 ? "item" : "items"}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}