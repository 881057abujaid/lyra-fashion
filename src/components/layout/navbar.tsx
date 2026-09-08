import Link from "next/link";
import {
    Heart,
    Search,
    ShoppingBag,
    UserRound,
} from "lucide-react";
import { MobileMenu } from "./mobile-menu";
import { SearchTrigger } from "./search-trigger";

type NavItem = {
    label: string;
    href: string;
};

const navItems: NavItem[] = [
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
];

export function Navbar() {
    return (
        <nav className="border-b border-lyra-border bg-lyra-cream">
            {/* Desktop Navigation */}
            <div className="relative mx-auto hidden h-20 max-w-7xl items-center px-6 lg:flex">
                {/* Left Navigation */}
                <div className="flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-xs font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-60"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Center Logo */}
                <Link
                    href="/"
                    className="font-display absolute left-1/2 -translate-x-1/2 text-3xl tracking-tight"
                    aria-label="LYRA Fashion home"
                >
                    LYRA
                </Link>

                {/* Right Actions */}
                <div className="ml-auto flex items-center gap-5">
                    <SearchTrigger />

                    <Link
                        href="/account"
                        aria-label="Account"
                        className="transition-opacity hover:opacity-60"
                    >
                        <UserRound size={19} strokeWidth={1.5} />
                    </Link>

                    <Link
                        href="/wishlist"
                        aria-label="Wishlist"
                        className="transition-opacity hover:opacity-60"
                    >
                        <Heart size={19} strokeWidth={1.5} />
                    </Link>

                    <Link
                        href="/cart"
                        aria-label="Shopping bag"
                        className="relative transition-opacity hover:opacity-60"
                    >
                        <ShoppingBag size={20} strokeWidth={1.5} />

                        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-lyra-black px-1 text-[9px] text-lyra-white">
                            0
                        </span>
                    </Link>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="flex h-16 items-center justify-between px-5 lg:hidden">
                <MobileMenu />

                <Link
                    href="/"
                    className="font-display text-2xl tracking-tight"
                    aria-label="LYRA Fashion home"
                >
                    LYRA
                </Link>

                <Link
                    href="/cart"
                    aria-label="Shopping bag"
                    className="relative transition-opacity hover:opacity-60"
                >
                    <ShoppingBag size={20} strokeWidth={1.5} />

                    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-lyra-black px-1 text-[9px] text-lyra-white">
                        0
                    </span>
                </Link>
            </div>
        </nav>
    );
}