import { getAdminDashboardStats } from "@/lib/data/admin";
import Link from "next/link";

export default async function AdminDashboardPage() {
    const stats = await getAdminDashboardStats();

    return (
        <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
            {/* Page Heading */}
            <div className="border-b border-lyra-border pb-7">
                <p className="text-[10px] uppercase tracking-[0.18em] text-lyra-muted">
                    Overview
                </p>

                <h1 className="mt-3 font-display text-4xl tracking-tight lg:text-5xl">
                    Dashboard
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-lyra-muted">
                    A quick overview of your LYRA Fashion
                    store.
                </p>
            </div>

            {/* Metrics */}
            <div className="mt-8 grid gap-px border border-lyra-border bg-lyra-border sm:grid-cols-2 xl:grid-cols-4">
                <Metric
                    label="Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`}
                />

                <Metric
                    label="Orders"
                    value={stats.totalOrders.toString()}
                />

                <Metric
                    label="Customers"
                    value={stats.totalCustomers.toString()}
                />

                <Metric
                    label="Products"
                    value={stats.totalProducts.toString()}
                />
            </div>

            {/* Recent Orders */}
            <section className="mt-10">
                <div className="mb-5 flex items-end justify-between border-b border-lyra-border pb-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-lyra-muted">
                            Activity
                        </p>

                        <h2 className="mt-2 font-display text-2xl">
                            Recent Orders
                        </h2>
                    </div>
                </div>

                {stats.recentOrders.length === 0 ? (
                    <div className="border border-lyra-border bg-lyra-white px-5 py-12 text-center">
                        <p className="text-sm text-lyra-muted">
                            No orders yet.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto border border-lyra-border bg-lyra-white">
                        <table className="w-full min-w-175 text-left">
                            <thead>
                                <tr className="border-b border-lyra-border">
                                    <th className="px-5 py-4 text-[10px] font-normal uppercase tracking-[0.14em] text-lyra-muted">
                                        Order
                                    </th>

                                    <th className="px-5 py-4 text-[10px] font-normal uppercase tracking-[0.14em] text-lyra-muted">
                                        Customer
                                    </th>

                                    <th className="px-5 py-4 text-[10px] font-normal uppercase tracking-[0.14em] text-lyra-muted">
                                        Total
                                    </th>

                                    <th className="px-5 py-4 text-[10px] font-normal uppercase tracking-[0.14em] text-lyra-muted">
                                        Payment
                                    </th>

                                    <th className="px-5 py-4 text-[10px] font-normal uppercase tracking-[0.14em] text-lyra-muted">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {stats.recentOrders.map(
                                    (order) => (
                                        <tr
                                            key={order.id}
                                            className="border-b border-lyra-border last:border-b-0"
                                        >
                                            <td className="px-5 py-5 text-sm">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="underline-offset-4 hover:underline"
                                                >
                                                    {order.orderNumber}
                                                </Link>
                                            </td>

                                            <td className="px-5 py-5 text-sm text-lyra-muted">
                                                {order.customerName}
                                            </td>

                                            <td className="px-5 py-5 text-sm">
                                                ₹
                                                {order.total.toLocaleString(
                                                    "en-IN"
                                                )}
                                            </td>

                                            <td className="px-5 py-5">
                                                <Status
                                                    value={
                                                        order.paymentStatus
                                                    }
                                                />
                                            </td>

                                            <td className="px-5 py-5">
                                                <Status
                                                    value={
                                                        order.status
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

function Metric({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="bg-lyra-white p-6 lg:p-7">
            <p className="text-[10px] uppercase tracking-[0.16em] text-lyra-muted">
                {label}
            </p>

            <p className="mt-4 font-display text-3xl tracking-tight">
                {value}
            </p>
        </div>
    );
}

function Status({
    value,
}: {
    value: string;
}) {
    return (
        <span className="inline-flex border border-lyra-border px-2.5 py-1 text-[9px] uppercase tracking-[0.12em] text-lyra-muted">
            {value}
        </span>
    );
}