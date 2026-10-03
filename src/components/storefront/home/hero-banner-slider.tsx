"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

type HeroBanner = {
    id: string;
    title: string | null;
    subtitle: string | null;
    desktopImageUrl: string | null;
    mobileImageUrl: string | null;
    imageAlt: string;
    ctaLabel: string | null;
    ctaHref: string | null;
};

type HeroBannerSliderProps = {
    banners: HeroBanner[];
};

export function HeroBannerSlider({
    banners,
}: HeroBannerSliderProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const autoplayTimerRef = useRef<number | null>(null);

    if (banners.length === 0) {
        return null;
    }

    const banner = banners[activeIndex];

    const hasMultipleBanners = banners.length > 1;

    useEffect(() => {
        if (banners.length <= 1 || isPaused) {
            return;
        }

        autoplayTimerRef.current = window.setTimeout(() => {
            setActiveIndex((current) =>
                current === banners.length - 1
                    ? 0
                    : current + 1,
            );
        }, 5000);

        return () => {
            if (autoplayTimerRef.current !== null) {
                window.clearTimeout(autoplayTimerRef.current);
            }
        };
    }, [activeIndex, banners.length, isPaused]);

    function goToPrevious() {
        setActiveIndex((current) =>
            current === 0
                ? banners.length - 1
                : current - 1,
        );
    }

    function goToNext() {
        setActiveIndex((current) =>
            current === banners.length - 1
                ? 0
                : current + 1,
        );
    }
    return (
        <section
            className="relative overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Desktop */}
            <div
                key={`desktop-${banner.id}`}
                className="lyra-hero-fade hidden md:block"
            >
                {banner.desktopImageUrl && (
                    <Image
                        src={banner.desktopImageUrl}
                        alt={banner.imageAlt}
                        width={1920}
                        height={840}
                        priority={activeIndex === 0}
                        className="h-auto w-full object-cover"
                    />
                )}
            </div>

            {/* Mobile */}
            <div
                key={`mobile-${banner.id}`}
                className="lyra-hero-fade block md:hidden"
            >
                {(
                    banner.mobileImageUrl ??
                    banner.desktopImageUrl
                ) && (
                        <Image
                            src={
                                banner.mobileImageUrl ??
                                banner.desktopImageUrl!
                            }
                            alt={banner.imageAlt}
                            width={1080}
                            height={1350}
                            priority={activeIndex === 0}
                            className="h-auto w-full object-cover"
                        />
                    )}
            </div>

            {/* Content */}
            {(banner.title ||
                banner.subtitle ||
                banner.ctaLabel) && (
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full px-6 sm:px-10 lg:px-16">
                            <div className="max-w-xl">
                                {banner.title && (
                                    <h1 className="font-display text-4xl leading-tight tracking-tight text-lyra-black sm:text-5xl lg:text-6xl">
                                        {banner.title}
                                    </h1>
                                )}

                                {banner.subtitle && (
                                    <p className="mt-4 max-w-md text-sm leading-6 text-neutral-700 sm:text-base">
                                        {banner.subtitle}
                                    </p>
                                )}

                                {banner.ctaLabel &&
                                    banner.ctaHref && (
                                        <Link
                                            href={banner.ctaHref}
                                            className="mt-7 inline-flex bg-neutral-900 px-6 py-3 text-sm font-medium tracking-wide text-white transition hover:bg-neutral-800"
                                        >
                                            {banner.ctaLabel}
                                        </Link>
                                    )}
                            </div>
                        </div>
                    </div>
                )}

            {/* Navigation */}
            {hasMultipleBanners && (
                <>
                    <button
                        type="button"
                        onClick={goToPrevious}
                        aria-label="Previous hero banner"
                        className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-lyra-white/80 backdrop-blur-sm transition hover:bg-lyra-white sm:left-6"
                    >
                        <ChevronLeft
                            size={18}
                            strokeWidth={1.5}
                        />
                    </button>

                    <button
                        type="button"
                        onClick={goToNext}
                        aria-label="Next hero banner"
                        className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-lyra-white/80 backdrop-blur-sm transition hover:bg-lyra-white sm:right-6"
                    >
                        <ChevronRight
                            size={18}
                            strokeWidth={1.5}
                        />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
                        {banners.map((item, index) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() =>
                                    setActiveIndex(index)
                                }
                                aria-label={`Go to hero banner ${index + 1}`}
                                aria-current={
                                    index === activeIndex
                                }
                                className={`h-1.5 transition-all ${index === activeIndex
                                    ? "w-8 bg-neutral-900"
                                    : "w-1.5 bg-neutral-900/40"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}