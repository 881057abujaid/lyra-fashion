"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { SearchOverlay } from "./search-overlay";

export function SearchTrigger() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                aria-label="Search"
                onClick={() => setIsOpen(true)}
                className="transition-opacity hover:opacity-60"
            >
                <Search size={19} strokeWidth={1.5} />
            </button>

            <SearchOverlay
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}