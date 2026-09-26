import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type OrderPaginationProps = {
    page: number,
    totalPages: number;
    total: number;
    pageSize: number;
    queryString: string;
};

export function OrderPagination({
    page,
    totalPages,
    total,
    pageSize,
    queryString,
}: OrderPaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);

    function getPageUrl(targetPage: number) {
        const params = new URLSearchParams(queryString);

        params.set("page", toString());

        return `/admin/orders?${params.toString()}`;
    }

    return (
        <div className="mt-5 flex flex-col gap-4 border border-lyra-border bg-lyra-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Result Count */}
            <p className="text-[10px] uppercase tracking-[0.12em] text-lyra-muted">
                Showing {start}-{end} of {total}{" "}
                {total === 1 ? "order" : "orders"}
            </p>

            {/* Navigation */}
            <div className="flex items-center gap-2">
                {page > 1 ? (
                    <Link
                        href={getPageUrl(page - 1)}
                        className="inline-flex h-9 items-center gap-2 border border-lyra-border px-3  text-[9px] uppercase tracking-[0.12em] text-lyra-muted transition-colors hover:border-lyra-black hover:text-lyra-black"
                    >
                        <ChevronLeft size={14} strokeWidth={1.5} />
                        Previous
                    </Link>
                ) : (
                    <span className="inline-flex h-9 items-center gap-2 border border-lyra-border px-3 text-[9px] uppercase tracking-[0.12em] text-lyra-subtle opacity-50">
                        <ChevronLeft size={14} strokeWidth={1.5} />
                        Previous
                    </span>
                )}

                <div className="flex h-9 min-w-9 items-center justify-center bg-lyra-black px-3 text-[10px] text-lyra-white">
                    {page}
                </div>

                {page < totalPages ? (
                    <Link
                        href={getPageUrl(page + 1)}
                        className="inline-flex h-9 items-center gap-2 border border-lyra-border px-3 text-[9px] uppercase tracking-[0.12em] text-lyra-muted transition-colors hover:border-lyra-black hover:text-lyra-black"
                    >
                        Next
                        <ChevronRight size={14} strokeWidth={1.5} />
                    </Link>
                ) : (
                    <span className="inline-flex h-9 items-center gap-2 border border-lyra-border px-3 text-[9px] uppercase tracking-[0.12em] text-lyra-subtle opacity-50">
                        Next
                        <ChevronRight size={14} strokeWidth={1.5} />
                    </span>
                )}
            </div>
        </div>
    );
}