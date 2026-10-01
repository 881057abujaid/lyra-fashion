import Link from "next/link";

import { getAdminCustomerById } from "@/lib/data/admin-customers";

type CustomerDetailPageProps = {
    params: Promise<{
        customerId: string;
    }>;
};

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

export default async function CustomerDetailPage({
    params,
}: CustomerDetailPageProps) {
    const { customerId } = await params;

    const customer = await getAdminCustomerById(customerId);

    if (!customer) {
        return (
            <div className="space-y-4">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                    Customers
                </p>

                <h1 className="font-serif text-3xl text-neutral-900">
                    Customer Not Found
                </h1>

                <Link
                    href="/admin/customers"
                    className="inline-block text-sm font-medium text-neutral-900 underline underline-offset-4"
                >
                    Back to Customers
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-10 px-10 py-10">
            {/* Header */}
            <div className="space-y-6">
                <Link
                    href="/admin/customers"
                    className="inline-flex items-center text-sm text-neutral-500 transition hover:text-neutral-900"
                >
                    ← Back to Customers
                </Link>

                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                        Customer
                    </p>

                    <h1 className="mt-2 font-serif text-4xl text-neutral-900">
                        {customer.name || "Unnamed Customer"}
                    </h1>

                    <p className="mt-2 text-sm text-neutral-500">
                        {customer.email || "No email address"}
                    </p>
                </div>
            </div>

            {/* Customer Summary */}
            <div className="grid md:grid-cols-3">
                <div className="border border-neutral-200 bg-white p-6">
                    <p className="text-xs uppercase tracking-wider text-neutral-500">
                        Total Orders
                    </p>

                    <p className="mt-3 font-serif text-3xl text-neutral-900">
                        {customer.orderCount}
                    </p>
                </div>

                <div className="border border-neutral-200 bg-white p-6">
                    <p className="text-xs uppercase tracking-wider text-neutral-500">
                        Total Spent
                    </p>

                    <p className="mt-3 font-serif text-3xl text-neutral-900">
                        {formatCurrency(customer.totalSpent)}
                    </p>
                </div>

                <div className="border border-neutral-200 bg-white p-6">
                    <p className="text-xs uppercase tracking-wider text-neutral-500">
                        Joined
                    </p>

                    <p className="mt-3 font-serif text-3xl text-neutral-900">
                        {formatDate(customer.createdAt)}
                    </p>
                </div>
            </div>

            {/* Order History */}
            <section className="space-y-4">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                        Activity
                    </p>

                    <h2 className="mt-2 font-serif text-2xl text-neutral-900">
                        Order History
                    </h2>
                </div>

                <div className="overflow-hidden border border-neutral-200 bg-white">
                    {customer.orders.length === 0 ? (
                        <div className="px-6 py-12 text-center text-sm text-neutral-500">
                            This customer has no orders yet.
                        </div>
                    ) : (
                        <div className="divide-y divide-neutral-100">
                            {customer.orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between"
                                >
                                    <div>
                                        <p className="font-medium text-neutral-900">
                                            {order.orderNumber}
                                        </p>

                                        <p className="mt-1 text-sm text-neutral-500">
                                            {formatDate(order.createdAt)}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-neutral-400">
                                                Status
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-neutral-900">
                                                {order.status}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-neutral-400">
                                                Payment
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-neutral-900">
                                                {order.paymentStatus}
                                            </p>
                                        </div>

                                        <div className="min-w-24 text-right">
                                            <p className="text-xs uppercase tracking-wider text-neutral-400">
                                                Total
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-neutral-900">
                                                {formatCurrency(order.total)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}