import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ProductPaginationProps = {
    page: number;
    totalPages: number;
    total: number;
    pageSize: number;
    queryString: string;
};

export function ProductPagination({
    page,
    totalPages,
    total,
    pageSize,
    queryString,
}: ProductPaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);

    function getPageUrl(targetPage: number) {
        const params = new URLSearchParams(queryString);

        params.set("page", targetPage.toString());

        return `/admin/products?${params.toString()}`;
    }

    return (
        <div className="mt-5 flex flex-col gap-4 border border-lyra-border bg-lyra-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] uppercase tracking-[0.12em] text-lyra-muted">
                Showing {start}–{end} of {total}{" "}
                {total === 1 ? "product" : "products"}
            </p>

            <div className="flex items-center gap-2">
                {page > 1 ? (
                    <Link
                        href={getPageUrl(page - 1)}
                        className="inline-flex h-9 items-center gap-2 border border-lyra-border px-3 text-[10px] uppercase tracking-widest text-lyra-black transition-colors hover:border-lyra-black"
                    >
                        <ChevronLeft className="h-3.5 w-3.5" />
                        Previous
                    </Link>
                ) : (
                    <span className="inline-flex h-9 items-center gap-2 border border-lyra-border px-3 text-[10px] uppercase tracking-widest text-lyra-muted opacity-50">
                        <ChevronLeft className="h-3.5 w-3.5" />
                        Previous
                    </span>
                )}

                <span className="inline-flex h-9 min-w-9 items-center justify-center bg-lyra-black px-3 text-[10px] text-lyra-white">
                    {page}
                </span>

                {page < totalPages ? (
                    <Link
                        href={getPageUrl(page + 1)}
                        className="inline-flex h-9 items-center gap-2 border border-lyra-border px-3 text-[10px] uppercase tracking-widest text-lyra-black transition-colors hover:border-lyra-black"
                    >
                        Next
                        <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                ) : (
                    <span className="inline-flex h-9 items-center gap-2 border border-lyra-border px-3 text-[10px] uppercase tracking-widest text-lyra-muted opacity-50">
                        Next
                        <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                )}
            </div>
        </div>
    );
}