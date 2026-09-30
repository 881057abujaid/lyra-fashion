"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

import { updateHeroBannerAction } from "@/lib/actions/admin-hero.actions";

type HeroBannerMetadataEditorProps = {
    heroBannerId: string;
    title: string | null;
    subtitle: string | null;
    imageAlt: string;
    ctaLabel: string | null;
    ctaHref: string | null;
    startAt: Date | null;
    endAt: Date | null;
    isActive: boolean;
};

function formatDateTimeLocal(date: Date | null) {
    if (!date) return "";

    const localDate = new Date(date);

    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const day = String(localDate.getDate()).padStart(2, "0");
    const hours = String(localDate.getHours()).padStart(2, "0");
    const minutes = String(localDate.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function HeroBannerMetadataEditor({
    heroBannerId,
    title,
    subtitle,
    imageAlt,
    ctaLabel,
    ctaHref,
    startAt,
    endAt,
    isActive,
}: HeroBannerMetadataEditorProps) {
    const router = useRouter();

    const [titleValue, setTitleValue] = useState(title ?? "");
    const [subtitleValue, setSubtitleValue] = useState(subtitle ?? "");
    const [imageAltValue, setImageAltValue] = useState(imageAlt);

    const [ctaLabelValue, setCtaLabelValue] = useState(
        ctaLabel ?? "",
    );

    const [ctaHrefValue, setCtaHrefValue] = useState(
        ctaHref ?? "",
    );

    const [startAtValue, setStartAtValue] = useState(
        formatDateTimeLocal(startAt),
    );

    const [endAtValue, setEndAtValue] = useState(
        formatDateTimeLocal(endAt),
    );

    const [isActiveValue, setIsActiveValue] = useState(isActive);

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsSaving(true);
        setError(null);
        setSuccess(false);

        try {
            if (!imageAltValue.trim()) {
                throw new Error("Image alt text is required");
            }

            if (
                (ctaLabelValue.trim() && !ctaHrefValue.trim()) ||
                (!ctaLabelValue.trim() && ctaHrefValue.trim())
            ) {
                throw new Error(
                    "CTA label and CTA link must be provided together",
                );
            }

            const startDate = startAtValue
                ? new Date(startAtValue)
                : null;

            const endDate = endAtValue
                ? new Date(endAtValue)
                : null;

            if (startDate && endDate && startDate >= endDate) {
                throw new Error("End date must be after start date");
            }

            await updateHeroBannerAction({
                id: heroBannerId,
                title: titleValue.trim() || undefined,
                subtitle: subtitleValue.trim() || undefined,
                imageAlt: imageAltValue.trim(),
                ctaLabel: ctaLabelValue.trim() || undefined,
                ctaHref: ctaHrefValue.trim() || undefined,
                startAt: startDate,
                endAt: endDate,
                isActive: isActiveValue,
            });

            setSuccess(true);
            router.refresh();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to save hero banner",
            );
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 mt-6"
        >
            {/* ================================
                Basic Information
            ================================= */}
            <section className="border border-lyra-border bg-white">
                <div className="border-b border-lyra-border px-6 py-5">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-lyra-subtle">
                        Hero Content
                    </p>

                    <h2 className="mt-1 font-display text-xl tracking-tight text-lyra-black">
                        Banner Details
                    </h2>
                </div>

                <div className="space-y-6 p-6">
                    {/* Title */}
                    <div>
                        <label
                            htmlFor="hero-title"
                            className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-lyra-muted"
                        >
                            Title
                        </label>

                        <input
                            id="hero-title"
                            type="text"
                            value={titleValue}
                            onChange={(event) =>
                                setTitleValue(event.target.value)
                            }
                            placeholder="Minimal. Modern. Effortless."
                            className="w-full border border-lyra-border bg-transparent px-4 py-3 text-sm text-lyra-black outline-none transition-colors placeholder:text-lyra-subtle focus:border-lyra-black"
                        />
                    </div>

                    {/* Subtitle */}
                    <div>
                        <label
                            htmlFor="hero-subtitle"
                            className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-lyra-muted"
                        >
                            Subtitle
                        </label>

                        <textarea
                            id="hero-subtitle"
                            value={subtitleValue}
                            onChange={(event) =>
                                setSubtitleValue(event.target.value)
                            }
                            placeholder="Discover the latest LYRA collection."
                            rows={4}
                            className="w-full resize-none border border-lyra-border bg-transparent px-4 py-3 text-sm leading-6 text-lyra-black outline-none transition-colors placeholder:text-lyra-subtle focus:border-lyra-black"
                        />
                    </div>

                    {/* Alt Text */}
                    <div>
                        <label
                            htmlFor="hero-alt"
                            className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-lyra-muted"
                        >
                            Image Alt Text
                            <span className="ml-1 text-lyra-black">
                                *
                            </span>
                        </label>

                        <input
                            id="hero-alt"
                            type="text"
                            value={imageAltValue}
                            onChange={(event) =>
                                setImageAltValue(event.target.value)
                            }
                            placeholder="Woman wearing the latest LYRA fashion collection"
                            required
                            className="w-full border border-lyra-border bg-transparent px-4 py-3 text-sm text-lyra-black outline-none transition-colors placeholder:text-lyra-subtle focus:border-lyra-black"
                        />

                        <p className="mt-2 text-xs text-lyra-muted">
                            Used for accessibility and SEO.
                        </p>
                    </div>
                </div>
            </section>

            {/* ================================
                Call To Action
            ================================= */}
            <section className="border border-lyra-border bg-white">
                <div className="border-b border-lyra-border px-6 py-5">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-lyra-subtle">
                        Action
                    </p>

                    <h2 className="mt-1 font-display text-xl tracking-tight text-lyra-black">
                        Call To Action
                    </h2>
                </div>

                <div className="grid gap-6 p-6 sm:grid-cols-2">
                    {/* CTA Label */}
                    <div>
                        <label
                            htmlFor="hero-cta-label"
                            className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-lyra-muted"
                        >
                            CTA Label
                        </label>

                        <input
                            id="hero-cta-label"
                            type="text"
                            value={ctaLabelValue}
                            onChange={(event) =>
                                setCtaLabelValue(event.target.value)
                            }
                            placeholder="SHOP NOW"
                            className="w-full border border-lyra-border bg-transparent px-4 py-3 text-sm text-lyra-black outline-none transition-colors placeholder:text-lyra-subtle focus:border-lyra-black"
                        />
                    </div>

                    {/* CTA Link */}
                    <div>
                        <label
                            htmlFor="hero-cta-href"
                            className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-lyra-muted"
                        >
                            CTA Link
                        </label>

                        <input
                            id="hero-cta-href"
                            type="text"
                            value={ctaHrefValue}
                            onChange={(event) =>
                                setCtaHrefValue(event.target.value)
                            }
                            placeholder="/shop"
                            className="w-full border border-lyra-border bg-transparent px-4 py-3 text-sm text-lyra-black outline-none transition-colors placeholder:text-lyra-subtle focus:border-lyra-black"
                        />
                    </div>
                </div>
            </section>

            {/* ================================
                Scheduling
            ================================= */}
            <section className="border border-lyra-border bg-white">
                <div className="border-b border-lyra-border px-6 py-5">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-lyra-subtle">
                        Visibility
                    </p>

                    <h2 className="mt-1 font-display text-xl tracking-tight text-lyra-black">
                        Scheduling
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-lyra-muted">
                        Leave both fields empty to keep the banner
                        available without a schedule.
                    </p>
                </div>

                <div className="grid gap-6 p-6 sm:grid-cols-2">
                    {/* Start */}
                    <div>
                        <label
                            htmlFor="hero-start-at"
                            className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-lyra-muted"
                        >
                            Start At
                        </label>

                        <input
                            id="hero-start-at"
                            type="datetime-local"
                            value={startAtValue}
                            onChange={(event) =>
                                setStartAtValue(event.target.value)
                            }
                            className="w-full border border-lyra-border bg-transparent px-4 py-3 text-sm text-lyra-black outline-none transition-colors focus:border-lyra-black"
                        />
                    </div>

                    {/* End */}
                    <div>
                        <label
                            htmlFor="hero-end-at"
                            className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-lyra-muted"
                        >
                            End At
                        </label>

                        <input
                            id="hero-end-at"
                            type="datetime-local"
                            value={endAtValue}
                            onChange={(event) =>
                                setEndAtValue(event.target.value)
                            }
                            className="w-full border border-lyra-border bg-transparent px-4 py-3 text-sm text-lyra-black outline-none transition-colors focus:border-lyra-black"
                        />
                    </div>
                </div>
            </section>

            {/* ================================
                Status
            ================================= */}
            <section className="border border-lyra-border bg-white">
                <div className="border-b border-lyra-border px-6 py-5">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-lyra-subtle">
                        Visibility
                    </p>

                    <h2 className="mt-1 font-display text-xl tracking-tight text-lyra-black">
                        Status
                    </h2>
                </div>

                <div className="p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.14em] text-lyra-muted">
                                Banner Status
                            </p>

                            <p className="mt-1 text-sm text-lyra-black">
                                {isActiveValue
                                    ? "This banner is active."
                                    : "This banner is inactive."}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setIsActiveValue(
                                    (current) => !current,
                                )
                            }
                            className={`border px-4 py-2 text-[10px] uppercase tracking-[0.14em] transition-colors ${isActiveValue
                                ? "border-lyra-black bg-lyra-black text-lyra-white"
                                : "border-lyra-border text-lyra-muted hover:border-lyra-black hover:text-lyra-black"
                                }`}
                        >
                            {isActiveValue ? "Active" : "Inactive"}
                        </button>
                    </div>
                </div>
            </section>

            {/* ================================
                Feedback
            ================================= */}
            {error && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {success && (
                <div className="border border-lyra-border bg-lyra-soft px-4 py-3 text-sm text-lyra-muted">
                    Hero banner updated successfully.
                </div>
            )}

            {/* ================================
                Actions
            ================================= */}
            <div className="flex justify-end border-t border-lyra-border pt-6">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 bg-lyra-black px-6 py-3 text-[10px] uppercase tracking-[0.14em] text-lyra-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Save className="h-3.5 w-3.5" />

                    {isSaving
                        ? "Saving..."
                        : "Save Changes"}
                </button>
            </div>
        </form>
    );
}