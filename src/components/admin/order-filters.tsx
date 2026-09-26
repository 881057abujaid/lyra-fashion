"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useState } from "react";

const paymentOptions = [
    "PENDING",
    "PAID",
    "FAILED",
    "REFUNDED"
] as const;

const statusOptions = [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
] as const;

export function OrderFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("search") ?? "");

    function updateFilters(key: string, value: string) {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        router.push(`/admin/orders?${params.toString()}`);
    }

    function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        updateFilters("search", search);
    }

    function clearFilters() {
        setSearch("");
        router.push("/admin/orders");
    }

    const hasFilters = Boolean(searchParams.get("search")) ||
        Boolean(searchParams.get("payment")) ||
        Boolean(searchParams.get("status"));

    return (
        <div className="border border-lyra-border bg-lyra-white p-4 lg:p-5">
            <div className="flex flex-col gap-4 xl:flex-row">
                {/* Search */}
                <form
                    onSubmit={handleSearchSubmit}
                    className="flex flex-1"
                >
                    <div className="relative flex-1">
                        <Search
                            size={16}
                            strokeWidth={1.5}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lyra-subtle"
                        />

                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="h-11 w-full border border-lyra-border bg-transparent pl-10 px-4 text-sm outline-none transition-colors placeholder:text-lyra-subtle focus:border-lyra-black"
                        />
                    </div>

                    <button
                        type="submit"
                        className="ml-2 h-11 border border-lyra-black bg-lyra-black px-5 text-[10px] uppercase tracking-[0.14em] text-lyra-white transition-opacity hover:opacity-80"
                    >
                        Search
                    </button>
                </form>

                {/* Filters */}
                <div className="flex flex-col gap-3 sm:flex-row">
                    <select
                        value={searchParams.get("payment") ?? ""}
                        onChange={(event) => updateFilters("payment", event.target.value)}
                        className="h-11 min-w-44 border border-lyra-border bg-lyra-white px-3 text-xs uppercase tracking-[0.08em] outline-none focus:border-lyra-border"
                    >
                        <option value="">All Payments</option>

                        {paymentOptions.map((payment) => (
                            <option
                                key={payment}
                                value={payment}
                            >
                                {formatStatus(payment)}
                            </option>
                        ))}
                    </select>

                    <select
                        value={searchParams.get("status") ?? ""}
                        onChange={(event) => updateFilters("status", event.target.value)}
                        className="h-11 min-w-44 border border-lyra-border bg-lyra-white px-3 text-xs uppercase tracking-[0.08em] outline-none focus:border-lyra-border"
                    >
                        <option value="">All Statuses</option>

                        {statusOptions.map((status) => (
                            <option
                                key={status}
                                value={status}
                            >
                                {formatStatus(status)}
                            </option>
                        ))}
                    </select>

                    {hasFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="inline-flex h-11 items-center justify-center gap-2 border border-lyra-border px-4 text-[10px] uppercase tracking-[0.12em] text-lyra-muted transition-colors hover:border-lyra-black hover:text-lyra-black"
                        >
                            <X size={14} strokeWidth={1.5} />
                            Clear
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function formatStatus(value: string) {
    return value.toLowerCase().replaceAll("_", " ");
}