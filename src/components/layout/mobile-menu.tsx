"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { SearchTrigger } from "./search-trigger";

type MenuItem = {
    label: string;
    href: string;
};

const menuItems: MenuItem[] = [
    {
        label: "Shop",
        href: "/shop",
    },
    {
        label: "Collections",
        href: "/collections",
    },
    {
        label: "Best Sellers",
        href: "/best-sellers",
    },
    {
        label: "About Us",
        href: "/about",
    },
    {
        label: "Contact",
        href: "/contact",
    },
];

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Menu Trigger */}
            <button
                type="button"
                aria-label="Open navigation menu"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(true)}
                className="transition-opacity duration-200 hover:opacity-60"
            >
                <Menu size={22} strokeWidth={1.5} />
            </button>

            {/* Mobile Navigation */}
            <div
                aria-hidden={!isOpen}
                className={`fixed inset-0 z-50 lg:hidden ${isOpen ? "pointer-events-auto" : "pointer-events-none"
                    }`}
            >
                {/* Backdrop */}
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    onClick={closeMenu}
                    className={`absolute inset-0 bg-black/20 transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"
                        }`}
                />

                {/* Menu Panel */}
                <aside
                    className={`absolute inset-y-0 left-0 w-full overflow-y-auto bg-lyra-cream transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    {/* Header */}
                    <div className="flex h-16 items-center justify-between border-b border-lyra-border px-5">
                        <Link
                            href="/"
                            onClick={closeMenu}
                            className="font-display text-2xl tracking-tight"
                        >
                            LYRA
                        </Link>

                        <button
                            type="button"
                            aria-label="Close navigation menu"
                            onClick={closeMenu}
                            className="transition-transform duration-300 hover:rotate-90"
                        >
                            <X size={22} strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* Main Navigation */}
                    <nav className="px-6 py-8">
                        {menuItems.map((item, index) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeMenu}
                                className={`group flex items-center justify-between border-b border-lyra-border py-5 font-display text-3xl tracking-tight transition-all duration-500 ${isOpen
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-4 opacity-0"
                                    }`}
                                style={{
                                    transitionDelay: isOpen ? `${index * 70 + 100}ms` : "0ms",
                                }}
                            >
                                <span className="transition-transform duration-300 group-hover:translate-x-2">
                                    {item.label}
                                </span>

                                <span className="text-sm font-body text-lyra-subtle opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    →
                                </span>
                            </Link>
                        ))}
                    </nav>

                    {/* Secondary Navigation */}
                    <div
                        className={`border-t border-lyra-border px-6 py-8 transition-all duration-500 ${isOpen
                            ? "translate-y-0 opacity-100 delay-500"
                            : "translate-y-4 opacity-0"
                            }`}
                    >
                        <div className="flex flex-col gap-6">
                            <SearchTrigger />

                            <Link href="/account" onClick={closeMenu} className="text-sm">
                                Account
                            </Link>

                            <Link href="/wishlist" onClick={closeMenu} className="text-sm">
                                Wishlist
                            </Link>
                        </div>
                    </div>
                </aside>
            </div>
        </>
    );
}