"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Boxes,
    Users,
    ExternalLink,
    LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navigation = [
    {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        label: "Orders",
        href: "/admin/orders",
        icon: ShoppingBag,
    },
    {
        label: "Products",
        href: "/admin/products",
        icon: Package,
    },
    {
        label: "Inventory",
        href: "/admin/inventory",
        icon: Boxes,
    },
    {
        label: "Customers",
        href: "/admin/customers",
        icon: Users,
    },
];

export function AdminSidebar() {
    const pathname = usePathname();

    async function handleSignOut() {
        await signOut({
            redirectTo: "/login",
        });
    }

    return (
        <aside className="hidden min-h-screen w-64 shrink-0 border-r border-lyra-border bg-lyra-white lg:flex lg:flex-col">
            {/* Brand */}
            <div className="border-b border-lyra-border px-7 py-6">
                <Link
                    href="/admin"
                    className="block"
                >
                    <p className="font-display text-2xl tracking-tight">
                        LYRA
                    </p>

                    <p className="mt-1 text-[9px] uppercase tracking-[0.22em] text-lyra-muted">
                        Administration
                    </p>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6">
                <p className="mb-4 px-3 text-[10px] uppercase tracking-[0.18em] text-lyra-subtle">
                    Workspace
                </p>

                <div className="space-y-1">
                    {navigation.map((item) => {
                        const Icon = item.icon;

                        const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-3 text-xs uppercase tracking-[0.12em] transition-colors ${isActive ? "bg-lyra-black text-lyra-white" : "text-lyra-muted hover:bg-lyra-cream hover:text-lyra-black"
                                    }`}
                            >
                                <Icon size={16} strokeWidth={1.5} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Button Actions */}
            <div className="border-t border-lyra-border p-4">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-3 text-xs uppercase tracking-[0.12em] text-lyra-muted transition-colors hover:bg-lyra-cream hover:text-lyra-black"
                >
                    <ExternalLink size={16} strokeWidth={1.5} />
                    <span>View Store</span>
                </Link>

                <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 px-3 py-3 text-xs uppercase tracking-[0.12em] text-lyra-muted transition-colors hover:bg-lyra-cream hover:text-lyra-black"
                >
                    <LogOut size={16} strokeWidth={1.5} />
                    <span>Log Out</span>
                </button>
            </div>
        </aside>
    );
}