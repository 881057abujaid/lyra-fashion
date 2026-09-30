import Link from "next/link";

const shopLinks = [
    { label: "Shop", href: "/shop" },
    { label: "Collections", href: "/collections" },
    { label: "Best Sellers", href: "/best-sellers" },
];

const customerCareLinks = [
    { label: "Contact", href: "/contact" },
    { label: "Shipping", href: "/shipping" },
    { label: "Returns", href: "/returns" },
];

const informationLinks = [
    { label: "About LYRA", href: "/about" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
];

export function Footer() {
    return (
        <footer className="border-t border-lyra-border bg-lyra-white">
            <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-10 lg:py-20">
                <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
                    {/* Brand */}
                    <div>
                        <Link
                            href="/"
                            className="font-display text-4xl tracking-tight text-lyra-black"
                        >
                            LYRA
                        </Link>

                        <p className="mt-4 max-w-xs text-sm leading-6 text-lyra-muted">
                            Minimal. Modern. Effortless.
                        </p>

                        <p className="mt-6 max-w-sm text-xs leading-5 text-lyra-subtle">
                            Thoughtfully designed fashion for a wardrobe that
                            feels as effortless as it looks.
                        </p>
                    </div>

                    {/* Shop */}
                    <div>
                        <h2 className="text-[10px] uppercase tracking-[0.18em] text-lyra-black">
                            Shop
                        </h2>

                        <nav className="mt-5 flex flex-col items-start gap-3">
                            {shopLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm text-lyra-muted transition-colors hover:text-lyra-black"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Customer Care */}
                    <div>
                        <h2 className="text-[10px] uppercase tracking-[0.18em] text-lyra-black">
                            Customer Care
                        </h2>

                        <nav className="mt-5 flex flex-col items-start gap-3">
                            {customerCareLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm text-lyra-muted transition-colors hover:text-lyra-black"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Information */}
                    <div>
                        <h2 className="text-[10px] uppercase tracking-[0.18em] text-lyra-black">
                            Information
                        </h2>

                        <nav className="mt-5 flex flex-col items-start gap-3">
                            {informationLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm text-lyra-muted transition-colors hover:text-lyra-black"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-14 flex flex-col gap-3 border-t border-lyra-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-lyra-subtle">
                        © {new Date().getFullYear()} LYRA Fashion
                    </p>

                    <p className="text-[10px] uppercase tracking-[0.14em] text-lyra-subtle">
                        Minimal. Modern. Effortless.
                    </p>
                </div>
            </div>
        </footer>
    );
}