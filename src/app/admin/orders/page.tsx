import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { z } from "zod";
import { getAdminOrders } from "@/lib/data/admin";
import { OrderFilters } from "@/components/admin/order-filters";
import { OrderPagination } from "@/components/admin/order-pagination";

type AdminOrdersPageProps = {
    searchParams: Promise<{
        search?: string;
        payment?: string;
        status?: string;
        page?: string;
    }>;
};

const OrderFiltersSchema = z.object({
    search: z.string().optional(),

    payment: z.enum([
        "PENDING",
        "PAID",
        "FAILED",
        "REFUNDED",
    ]).optional(),

    status: z.enum([
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
    ]).optional(),
});

export default async function AdminOrdersPage({
    searchParams
}: AdminOrdersPageProps) {

    const params = await searchParams;
    const filters = OrderFiltersSchema.parse(params);
    const requestedPage = Number(params.page ?? "1");
    const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const result = await getAdminOrders(
        {
            search: filters.search,
            paymentStatus: filters.payment,
            orderStatus: filters.status,
        },
        page,
        20
    );

    const queryString = new URLSearchParams(
        Object.entries(params).filter(
            ([, value]) => value !== undefined
        ) as [string, string][]
    ).toString();

    const {
        orders,
        total,
        page: currentPage,
        pageSize,
        totalPages,
    } = result;

    return (
        <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
            {/* Page Header */}
            <div className="border-b border-lyra-border pb-7">
                <p className="text-[10px] uppercase tracking-[0.18em] text-lyra-muted">
                    Management
                </p>

                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="font-display text-4xl tracking-tight lg:text-5xl">
                            Orders
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-lyra-muted">
                            Manage customer orders and review payment activity.
                        </p>
                    </div>

                    <p className="text-xs uppercase tracking-[0.12em] text-lyra-subtle">
                        {orders.length}{" "}
                        {orders.length === 1 ? "Order" : "Orders"}
                    </p>
                </div>
            </div>

            <div className="mt-8">
                <OrderFilters />
            </div>

            {/* Orders Table */}
            <section className="mt-8">
                {orders.length === 0 ? (
                    <div className="border border-lyra-border bg-lyra-white px-5 py-16 text-center">
                        <p className="font-display text-2xl">
                            No orders yet
                        </p>

                        <p className="mt-2 text-sm text-lyra-muted">
                            Orders will appear here once customers complete checkoout.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto border border-lyra-border bg-lyra-white">
                        <table className="w-full min-w-225 text-left">
                            <thead>
                                <tr className="border border-lyra-border">
                                    <TableHeading>
                                        Order
                                    </TableHeading>
                                    <TableHeading>
                                        Customer
                                    </TableHeading>
                                    <TableHeading>
                                        Total
                                    </TableHeading>
                                    <TableHeading>
                                        Payment
                                    </TableHeading>
                                    <TableHeading>
                                        Status
                                    </TableHeading>
                                    <TableHeading>
                                        Date
                                    </TableHeading>
                                    <th className="px-5 py-4">
                                        <span className="sr-only">
                                            View
                                        </span>
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="group border-b border-lyra-border last:border-b-0"
                                    >
                                        <td className="px-5 py-5">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="text-sm underline-offset-4 transition-opacity hover:underline"
                                            >
                                                {
                                                    order.orderNumber
                                                }
                                            </Link>
                                        </td>

                                        <td className="px-5 py-5">
                                            <div>
                                                <p className="text-sm">
                                                    {
                                                        order.customerName
                                                    }
                                                </p>

                                                <p className="mt-1 text-sx text-lyra-muted">
                                                    {
                                                        order.customerEmail
                                                    }
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-5 py-5 text-sm">
                                            ₹{order.total.toLocaleString("en-IN")}
                                        </td>

                                        <td className="px-5 py-5">
                                            <StatusBadge value={order.paymentStatus} />
                                        </td>

                                        <td className="px-5 py-5">
                                            <StatusBadge value={order.status} />
                                        </td>

                                        <td className="px-5 py-5 text-xs text-lyra-muted">
                                            {formatOrderDate(order.createdAt)}
                                        </td>

                                        <td className="px-5 py-5 text-right">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                aria-label={`View ${order.orderNumber}`}
                                                className="inline-flex items-center justify-center p-2 text-lyra-muted transition-colors hover:text-lyra-black"
                                            >
                                                <ArrowUpRight
                                                    size={16}
                                                    strokeWidth={1.5}
                                                />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* Pagination */}
            <OrderPagination
                page={currentPage}
                totalPages={totalPages}
                total={total}
                pageSize={20}
                queryString={queryString}
            />
        </div>
    );
}

function TableHeading({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <th className="px-5 py-4 text-[10px] font-normal uppercase tracking-[0.14em] text-lyra-muted">
            {children}
        </th>
    );
}

function StatusBadge({
    value,
}: {
    value: string
}) {
    return (
        <span className="inline-flex border border-lyra-border px-2.5 py-1 uppercase tracking-[0.12em] text-lyra-muted">
            {value}
        </span>
    );
}

function formatOrderDate(data: Date) {
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(data);
}