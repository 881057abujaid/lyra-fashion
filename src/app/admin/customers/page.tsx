import Link from "next/link";

import { getAdminCustomers } from "@/lib/data/admin-customers";

type CustomersPageProps = {
    searchParams: Promise<{
        search?: string;
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

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
    const params = await searchParams;
    const search = params.search ?? "";
    const customers = await getAdminCustomers(search);

    return (
        <div className="space-y-8 max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
            <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                    Customers
                </p>

                <h1 className="mt-2 font-serif text-3xl text-neutral-900">
                    Customer Management
                </h1>

                <p className="mt-2 text-sm text-neutral-500">
                    View customers, order activity, and spending history.
                </p>
            </div>

            <form
                method="GET"
                className="flex items-center gap-3 border border-neutral-200 bg-white p-4"
            >
                <input
                    type="search"
                    name="search"
                    defaultValue={search}
                    placeholder="Search by customer name or email..."
                    className="min-w-0 flex-1 border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
                />

                <button
                    type="submit"
                    className="shrink-0 bg-neutral-900 px-7 py-3 text-xs font-medium uppercase tracking-[0.12em] text-white transition hover:bg-neutral-800"
                >
                    Search
                </button>
            </form>

            <div className="overflow-hidden border border-neutral-200 bg-white">
                <table className="w-full text-left">
                    <thead className="border-b border-neutral-200 bg-neutral-50">
                        <tr>
                            <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-neutral-500">
                                Customer
                            </th>

                            <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-neutral-500">
                                Email
                            </th>

                            <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-neutral-500">
                                Orders
                            </th>

                            <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-neutral-500">
                                Total Spent
                            </th>

                            <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-neutral-500">
                                Joined
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-neutral-100">
                        {customers.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-6 py-12 text-center text-sm text-neutral-500"
                                >
                                    No customers found.
                                </td>
                            </tr>
                        ) : (
                            customers.map((customer) => (
                                <tr
                                    key={customer.id}
                                    className="transition hover:bg-neutral-50"
                                >
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/admin/customers/${customer.id}`}
                                            className="font-medium text-neutral-900 transition hover:text-neutral-500"
                                        >
                                            {customer.name || "Unnamed Customer"}
                                        </Link>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-neutral-500">
                                        {customer.email || "—"}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-neutral-700">
                                        {customer.orderCount}
                                    </td>

                                    <td className="px-6 py-4 text-sm font-medium text-neutral-900">
                                        {formatCurrency(customer.totalSpent)}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-neutral-500">
                                        {formatDate(customer.createdAt)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}