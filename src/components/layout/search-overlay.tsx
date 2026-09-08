"use client";

import { useEffect, useState, useRef } from "react";
import { Search, X } from "lucide-react";

type SearchOverlayProps = {
    isOpen: boolean;
    onClose: () => void;
};

const trendingSearches = [
    "Trousers",
    "Wide Leg",
    "New Arrivals",
    "Workwear",
];

export function SearchOverlay({
    isOpen,
    onClose,
}: SearchOverlayProps) {
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        inputRef.current?.focus();
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const handleClose = () => {
        setQuery("");
        onClose();
    };

    const handleTrendingSearch = (search: string) => {
        setQuery(search);
        inputRef.current?.focus();
    };

    return (
        <div
            aria-hidden={!isOpen}
            className={`fixed inset-0 z-50 bg-lyra-cream transition-opacity duration-500 ${isOpen
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
                }`}
        >
            <div className={`mx-auto flex h-full max-w-7xl flex-col px-6 transition-transform duration-500 ${isOpen ? "translate-y-0" : "-translate-y-4"
                }`}>
                {/* Header */}
                <header className="flex h-20 items-center justify-between border-b border-lyra-border">
                    <span className="font-display text-2xl tracking-tight">
                        LYRA
                    </span>

                    <button
                        type="button"
                        onClick={handleClose}
                        aria-label="Close search"
                        className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] transition-opacity hover:opacity-60"
                    >
                        Close
                        <X size={20} strokeWidth={1.5} />
                    </button>
                </header>

                {/* Search Content */}
                <div className="flex flex-1 flex-col pt-20 md:pt-28">
                    <p className="text-xs uppercase tracking-[0.2em] text-lyra-muted">
                        Search LYRA
                    </p>

                    <div className="mt-6 flex items-center gap-4 border-b border-lyra-black pb-4">
                        <Search
                            size={24}
                            strokeWidth={1.5}
                            className="shrink-0"
                        />

                        <input
                            ref={inputRef}
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="what are you looking for?"
                            className="w-full bg-transparent font-display text-3xl outline-none placeholder:text-lyra-subtle md:text-5xl"
                            aria-label="Search products"
                        />

                        {query && (
                            <button
                                type="button"
                                onClick={() => setQuery("")}
                                aria-label="Clear search"
                                className="shrink-0 text-lyra-muted transition-opacity hover:opacity-60"
                            >
                                <X size={18} strokeWidth={1.5} />
                            </button>
                        )}
                    </div>

                    {/* Trending */}
                    <div className="mt-12">
                        <p className="text-xs uppercase tracking-[0.2em] text-lyra-muted">
                            Trending Searches
                        </p>

                        <div className="mt-5 flex flex-wrap-3">
                            {trendingSearches.map((search) => (
                                <button
                                    key={search}
                                    type="button"
                                    onClick={() => handleTrendingSearch(search)}
                                    className="border border-lyra-border px-5 py-3 text-sm transition-colors hover:border-lyra-black"
                                >
                                    {search}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}