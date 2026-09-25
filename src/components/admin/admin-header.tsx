import Link from "next/link";
import { Menu } from "lucide-react";

export function AdminHeader() {
    return (
        <header className="flex h-16 items-center justify-between border-b border-lyra-border bg-lyra-cream px-5 lg:px-8">
            {/* Mobile Menu */}
            <button
                type="button"
                className="flex items-center justify-center lg:hidden"
                aria-label="Open admin menu"
            >
                <Menu size={20} strokeWidth={1.5} />
            </button>

            {/* Mobile Logo */}
            <Link
                href="/admin"
                className="font-display text-xl tracking-tight lg:hidden"
            >
                LYRA
            </Link>

            {/* Desktop Header */}
            <div className="hidden lg:block">
                <p className="text-[10px] uppercase tracking-[0.18em] text-lyra-muted">
                    Administration
                </p>
            </div>

            <div className="text-[10px] uppercase tracking-[0.14em] text-lyra-subtle">
                LYRA Fashion
            </div>
        </header>
    );
}