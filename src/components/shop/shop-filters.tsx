"use client";

import { useEffect, useRef, useState } from "react";
import {
    ChevronDown,
    Check,
} from "lucide-react";
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";

const categories = [
    { label: "All", value: "" },
    { label: "Tops", value: "Tops" },
    { label: "Bottoms", value: "Bottoms" },
    { label: "Dresses", value: "Dresses" },
    { label: "Outerwear", value: "Outerwear" },
];

const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Featured", value: "featured" },
    { label: "Price: Low to High", value: "price-low" },
    { label: "Price: High to Low", value: "price-high" },
];

export function ShopFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isSortOpen, setIsSortOpen] = useState(false);

    const sortRef = useRef<HTMLDivElement>(null);

    const activeCategory =
        searchParams.get("category") ?? "";

    const activeSort =
        searchParams.get("sort") ?? "newest";

    const selectedSort =
        sortOptions.find(
            (option) => option.value === activeSort
        ) ?? sortOptions[0];

    function updateParams(
        key: string,
        value: string
    ) {
        const params = new URLSearchParams(
            searchParams.toString()
        );

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        router.push(
            `${pathname}?${params.toString()}`
        );
    }

    function handleSortChange(value: string) {
        updateParams("sort", value);
        setIsSortOpen(false);
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                sortRef.current &&
                !sortRef.current.contains(
                    event.target as Node
                )
            ) {
                setIsSortOpen(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsSortOpen(false);
            }
        }

        document.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {
            document.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, []);

    return (
        <div className="mt-8 flex flex-col gap-6 border-b border-lyra-border pb-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Categories */}
            <div className="flex flex-wrap items-center gap-2">
                {categories.map((category) => {
                    const isActive =
                        activeCategory === category.value;

                    return (
                        <button
                            key={category.label}
                            type="button"
                            onClick={() =>
                                updateParams(
                                    "category",
                                    category.value
                                )
                            }
                            className={`px-4 py-2 text-xs transition-colors ${isActive
                                ? "bg-lyra-black text-lyra-white"
                                : "border border-lyra-border hover:border-lyra-black"
                                }`}
                        >
                            {category.label}
                        </button>
                    );
                })}
            </div>

            {/* Sort */}
            <div
                ref={sortRef}
                className="relative flex items-center gap-3"
            >
                <span className="text-[10px] uppercase tracking-[0.18em] text-lyra-muted">
                    Sort
                </span>

                <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={isSortOpen}
                    onClick={() =>
                        setIsSortOpen((current) => !current)
                    }
                    className="flex min-w-48 items-center justify-between gap-6 border border-lyra-border px-4 py-2.5 text-xs transition-colors hover:border-lyra-black"
                >
                    <span>{selectedSort.label}</span>

                    <ChevronDown
                        size={14}
                        strokeWidth={1.5}
                        className={`transition-transform duration-200 ${isSortOpen
                            ? "rotate-180"
                            : ""
                            }`}
                    />
                </button>

                {isSortOpen && (
                    <div
                        role="listbox"
                        aria-label="Sort products"
                        className="absolute right-0 top-full z-30 mt-2 min-w-48 overflow-hidden border border-lyra-border bg-lyra-white py-1 shadow-xl"                    >
                        {sortOptions.map((option) => {
                            const isSelected =
                                activeSort === option.value;

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    role="option"
                                    aria-selected={
                                        isSelected
                                    }
                                    onClick={() =>
                                        handleSortChange(
                                            option.value
                                        )
                                    }
                                    className={`flex w-full items-center justify-between px-4 py-3 text-left text-xs transition-colors ${isSelected
                                            ? "bg-lyra-black text-lyra-white"
                                            : "text-lyra-black hover:bg-lyra-beige"
                                        }`}                                >
                                    <span>
                                        {option.label}
                                    </span>

                                    {isSelected && (
                                        <Check
                                            size={14}
                                            strokeWidth={1.5}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}