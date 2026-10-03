import Link from "next/link";
import Image from "next/image";
import { getAllHeroBanners } from "@/lib/data/hero-banners";
import { DeleteHeroBannerButton } from "@/components/admin/homepage/delete-hero-banner";

export default async function AdminHomePage() {
    const heroBanners = await getAllHeroBanners();

    return (
        <div className="px-6 py-8 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Page Header */}
                <div className="mb-8">
                    <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-lyra-subtle">
                        Storefront
                    </p>

                    <div className="flex items-end justify-between gap-6">
                        <h1 className="font-display text-3xl tracking-tight text-lyra-black">
                            Homepage
                        </h1>

                        <p className="mt-2 max-w-xl text-sm text-lyra-muted">
                            Manage the content and visual sections displayed across the LYRA Storefront.
                        </p>
                    </div>
                </div>
            </div>

            {/* Hero Banners */}
            <section>
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-medium uppercase tracking-[0.12em] text-lyra-black">
                            Hero Banners
                        </h2>

                        <p className="mt-1 text-xs text-lyra-muted">
                            Manage the primary visual content displayed on the homepage.
                        </p>
                    </div>

                    <Link
                        href="/admin/homepage/new"
                        className="inline-flex bg-lyra-black px-5 py-3 text-[10px] uppercase tracking-[0.14em] text-lyra-white transition-opacity hover:opacity-90"
                    >
                        Add Hero Banner
                    </Link>
                </div>

                {heroBanners.length === 0 ? (
                    <div className="border border-dashed border-lyra-border bg-lyra-white px-6 py-16 text-center">
                        <p className="font-display text-xl text-lyra-black">
                            No hero banners yet
                        </p>

                        <p className="mx-auto mt-2 max-w-md text-sm text-lyra-muted">
                            Create your first hero banner to start building the LYRA homepage experience.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {heroBanners.map((banner) => (
                            <div
                                key={banner.id}
                                className="border border-lyra-border bg-lyra-white p-4"
                            >
                                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                                    {/* Banner Thumbnail */}
                                    <div className="relative aspect-16/7 w-full shrink-0 overflow-hidden bg-lyra-beige sm:w-56">
                                        {banner.desktopImageUrl ? (
                                            <Image
                                                src={banner.desktopImageUrl}
                                                alt={banner.imageAlt}
                                                fill
                                                sizes="224px"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center">
                                                <p className="text-[10px] uppercase tracking-[0.14em] text-lyra-subtle">
                                                    No Image
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Banner Content */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-lyra-black">
                                                    {banner.title ||
                                                        "Untitled Hero Banner"}
                                                </p>

                                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-lyra-muted">
                                                    {banner.subtitle ||
                                                        "No subtitle added."}
                                                </p>
                                            </div>

                                            <span className="shrink-0 text-[10px] uppercase tracking-[0.14em] text-lyra-subtle">
                                                #{banner.sortOrder + 1}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex items-center gap-2">
                                            <span
                                                className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] ${banner.isActive
                                                    ? "text-lyra-black"
                                                    : "text-lyra-muted"
                                                    }`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${banner.isActive
                                                        ? "bg-lyra-black"
                                                        : "bg-lyra-subtle"
                                                        }`}
                                                />

                                                {banner.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex shrink-0 items-center gap-3 sm:border-l sm:border-lyra-border sm:pl-5">
                                        <Link
                                            href={`/admin/homepage/${banner.id}/edit`}
                                            className="border border-lyra-border px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-lyra-muted transition-colors hover:border-lyra-black hover:text-lyra-black"
                                        >
                                            Edit
                                        </Link>

                                        <DeleteHeroBannerButton
                                            heroBannerId={banner.id}
                                            bannerTitle={
                                                banner.title ||
                                                "Untitled Hero Banner"
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}