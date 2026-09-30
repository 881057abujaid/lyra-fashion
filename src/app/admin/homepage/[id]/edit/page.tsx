import Link from "next/link";
import { notFound } from "next/navigation";

import { getHeroBannerById } from "@/lib/data/hero-banners";
import { HeroBannerMediaEditor } from "@/components/admin/homepage/hero-banner-media-editor";
import { HeroBannerMetadataEditor } from "@/components/admin/homepage/hero-banner-metadata-editor";

type EditHeroBannerPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditHeroBannerPage({
    params,
}: EditHeroBannerPageProps) {
    const { id } = await params;

    const heroBanner = await getHeroBannerById(id);

    if (!heroBanner) {
        notFound();
    }

    return (
        <div className="px-5 py-6 lg:px-6">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href="/admin/homepage"
                        className="text-[10px] uppercase tracking-[0.14em] text-lyra-muted transition-colors hover:text-lyra-black"
                    >
                        ← Back to Homepage
                    </Link>

                    <div className="mt-5">
                        <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-lyra-subtle">
                            Homepage
                        </p>

                        <div className="flex items-start justify-between gap-6">
                            <div>
                                <h1 className="font-display text-3xl tracking-tight text-lyra-black">
                                    {heroBanner.title || "Edit Hero Banner"}
                                </h1>

                                <p className="mt-2 text-sm text-lyra-muted">
                                    Manage the content and media for this
                                    homepage hero banner.
                                </p>
                            </div>

                            <span
                                className={`shrink-0 border px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] ${heroBanner.isActive
                                    ? "border-lyra-black bg-lyra-black text-lyra-white"
                                    : "border-lyra-border text-lyra-muted"
                                    }`}
                            >
                                {heroBanner.isActive
                                    ? "Active"
                                    : "Inactive"}
                            </span>
                        </div>
                    </div>
                </div>

                <HeroBannerMediaEditor
                    heroBannerId={heroBanner.id}
                    desktopImageUrl={heroBanner.desktopImageUrl}
                    mobileImageUrl={heroBanner.mobileImageUrl}
                />

                <HeroBannerMetadataEditor
                    heroBannerId={heroBanner.id}
                    title={heroBanner.title}
                    subtitle={heroBanner.subtitle}
                    imageAlt={heroBanner.imageAlt}
                    ctaLabel={heroBanner.ctaLabel}
                    ctaHref={heroBanner.ctaHref}
                    startAt={heroBanner.startAt}
                    endAt={heroBanner.endAt}
                    isActive={heroBanner.isActive}
                />
            </div>
        </div>
    );
}