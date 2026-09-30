import Link from "next/link";

import { HeroBannerForm } from "@/components/admin/homepage/hero-banner-form";

export default function NewHeroBannerPage() {
    return (
        <div className="px-5 py-6 lg:px-6">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href="/admin/homepage"
                        className="text-[10px] uppercase tracking-[0.14em] text-lyra-muted transition-colors hover:text-lyra-black"
                    >
                        ← Back to Homepage
                    </Link>

                    <div className="mt-6">
                        <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-lyra-subtle">
                            Homepage
                        </p>

                        <h1 className="font-display text-3xl tracking-tight text-lyra-black">
                            Add Hero Banner
                        </h1>

                        <p className="mt-2 text-sm text-lyra-muted">
                            Create the content and configuration for a new
                            homepage hero banner.
                        </p>
                    </div>
                </div>

                <HeroBannerForm />
            </div>
        </div>
    );
}