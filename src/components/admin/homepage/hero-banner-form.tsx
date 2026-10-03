"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
    createHeroBannerAction,
} from "@/lib/actions/admin-hero.actions";

import {
    uploadHeroBannerImage,
} from "@/lib/actions/admin-hero-media.actions";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

export function HeroBannerForm() {
    const router = useRouter();

    const desktopInputRef = useRef<HTMLInputElement>(null);
    const mobileInputRef = useRef<HTMLInputElement>(null);

    const [isPending, startTransition] = useTransition();

    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [imageAlt, setImageAlt] = useState("");

    const [ctaLabel, setCtaLabel] = useState("");
    const [ctaHref, setCtaHref] = useState("");

    const [startAt, setStartAt] = useState("");
    const [endAt, setEndAt] = useState("");

    const [desktopFile, setDesktopFile] = useState<File | null>(null);
    const [mobileFile, setMobileFile] = useState<File | null>(null);

    const [desktopPreview, setDesktopPreview] = useState<string | null>(
        null,
    );
    const [mobilePreview, setMobilePreview] = useState<string | null>(
        null,
    );

    const [error, setError] = useState<string | null>(null);
    const [createdBannerId, setCreatedBannerId] = useState<string | null>(
        null,
    );

    useEffect(() => {
        return () => {
            if (desktopPreview) {
                URL.revokeObjectURL(desktopPreview);
            }

            if (mobilePreview) {
                URL.revokeObjectURL(mobilePreview);
            }
        };
    }, [desktopPreview, mobilePreview]);

    function validateImage(file: File) {
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            return "Only JPG, PNG, and WebP images are allowed.";
        }

        if (file.size > MAX_IMAGE_SIZE) {
            return "Image size must be 5MB or less.";
        }

        return null;
    }

    function handleDesktopFileChange(
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const validationError = validateImage(file);

        if (validationError) {
            setError(validationError);
            event.target.value = "";
            return;
        }

        setError(null);

        if (desktopPreview) {
            URL.revokeObjectURL(desktopPreview);
        }

        setDesktopFile(file);
        setDesktopPreview(URL.createObjectURL(file));
    }

    function handleMobileFileChange(
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const validationError = validateImage(file);

        if (validationError) {
            setError(validationError);
            event.target.value = "";
            return;
        }

        setError(null);

        if (mobilePreview) {
            URL.revokeObjectURL(mobilePreview);
        }

        setMobileFile(file);
        setMobilePreview(URL.createObjectURL(file));
    }

    function removeDesktopFile() {
        if (desktopPreview) {
            URL.revokeObjectURL(desktopPreview);
        }

        setDesktopFile(null);
        setDesktopPreview(null);

        if (desktopInputRef.current) {
            desktopInputRef.current.value = "";
        }
    }

    function removeMobileFile() {
        if (mobilePreview) {
            URL.revokeObjectURL(mobilePreview);
        }

        setMobileFile(null);
        setMobilePreview(null);

        if (mobileInputRef.current) {
            mobileInputRef.current.value = "";
        }
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError(null);

        if (!desktopFile) {
            setError("Desktop banner image is required.");
            return;
        }

        if (!imageAlt.trim()) {
            setError("Image alt text is required.");
            return;
        }

        if (ctaLabel.trim() && !ctaHref.trim()) {
            setError("Please enter a CTA link.");
            return;
        }

        if (!ctaLabel.trim() && ctaHref.trim()) {
            setError("Please enter a CTA label.");
            return;
        }

        if (
            startAt &&
            endAt &&
            new Date(startAt) >= new Date(endAt)
        ) {
            setError("End date must be after start date.");
            return;
        }

        startTransition(async () => {
            let bannerId: string | null = null;

            try {
                /*
                 * Step 1:
                 * Create the banner as an inactive draft.
                 */
                const banner = await createHeroBannerAction({
                    title: title.trim() || undefined,
                    subtitle: subtitle.trim() || undefined,
                    imageAlt: imageAlt.trim(),
                    ctaLabel: ctaLabel.trim() || undefined,
                    ctaHref: ctaHref.trim() || undefined,
                    startAt: startAt
                        ? new Date(startAt)
                        : undefined,
                    endAt: endAt
                        ? new Date(endAt)
                        : undefined,
                    sortOrder: 0,
                    isActive: false,
                });

                bannerId = banner.id;
                setCreatedBannerId(banner.id);

                /*
                 * Step 2:
                 * Upload required desktop image.
                 */
                await uploadHeroBannerImage(
                    banner.id,
                    "desktop",
                    desktopFile,
                );

                /*
                 * Step 3:
                 * Upload mobile image if selected.
                 */
                if (mobileFile) {
                    await uploadHeroBannerImage(
                        banner.id,
                        "mobile",
                        mobileFile,
                    );
                }

                /*
                 * Step 4:
                 * Continue to edit page where the admin
                 * can review/activate the banner.
                 */
                router.push(
                    `/admin/homepage/${banner.id}/edit`,
                );

                router.refresh();
            } catch (error) {
                console.error(error);

                if (bannerId) {
                    setError(
                        "The banner was created, but the image upload could not be completed. Open the draft below and retry the upload.",
                    );
                } else {
                    setError(
                        error instanceof Error
                            ? error.message
                            : "Something went wrong while creating the hero banner.",
                    );
                }
            }
        });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-8"
        >
            {/* ================================
                Media
            ================================= */}
            <section className="border border-lyra-border bg-lyra-white">
                <div className="border-b border-lyra-border px-6 py-5">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-lyra-subtle">
                        Media
                    </p>

                    <h2 className="mt-1 font-display text-xl tracking-tight text-lyra-black">
                        Banner Images
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-lyra-muted">
                        Upload the desktop image and optionally provide a
                        dedicated mobile image.
                    </p>
                </div>

                <div className="grid gap-6 p-6 lg:grid-cols-2">
                    {/* Desktop */}
                    <div>
                        <div className="mb-3 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.16em] text-lyra-subtle">
                                    Desktop Image
                                </p>

                                <p className="mt-1 text-xs text-lyra-muted">
                                    Required · JPG, PNG or WebP · Max 5MB
                                </p>
                            </div>

                            {desktopFile && (
                                <button
                                    type="button"
                                    onClick={removeDesktopFile}
                                    className="text-[10px] uppercase tracking-[0.14em] text-lyra-muted transition-colors hover:text-lyra-black"
                                >
                                    Remove
                                </button>
                            )}
                        </div>

                        <div className="relative aspect-16/7 overflow-hidden bg-lyra-beige">
                            {desktopPreview ? (
                                <img
                                    src={desktopPreview}
                                    alt="Desktop banner preview"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <button
                                    type="button"
                                    onClick={() =>
                                        desktopInputRef.current?.click()
                                    }
                                    className="flex h-full w-full flex-col items-center justify-center border border-dashed border-lyra-border text-lyra-muted transition-colors hover:border-lyra-black hover:text-lyra-black"
                                >
                                    <span className="text-2xl">
                                        +
                                    </span>

                                    <span className="mt-2 text-[10px] uppercase tracking-[0.16em]">
                                        Choose Desktop Image
                                    </span>
                                </button>
                            )}
                        </div>

                        {desktopFile && (
                            <button
                                type="button"
                                onClick={() =>
                                    desktopInputRef.current?.click()
                                }
                                className="mt-3 text-[10px] uppercase tracking-[0.14em] text-lyra-muted transition-colors hover:text-lyra-black"
                            >
                                Replace Image
                            </button>
                        )}

                        <input
                            ref={desktopInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleDesktopFileChange}
                            className="hidden"
                        />
                    </div>

                    {/* Mobile */}
                    <div>
                        <div className="mb-3 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.16em] text-lyra-subtle">
                                    Mobile Image
                                </p>

                                <p className="mt-1 text-xs text-lyra-muted">
                                    Optional · JPG, PNG or WebP · Max 5MB
                                </p>
                            </div>

                            {mobileFile && (
                                <button
                                    type="button"
                                    onClick={removeMobileFile}
                                    className="text-[10px] uppercase tracking-[0.14em] text-lyra-muted transition-colors hover:text-lyra-black"
                                >
                                    Remove
                                </button>
                            )}
                        </div>

                        <div
                            className="relative aspect-4/5 overflow-hidden bg-lyra-beige"
                        >
                            {mobilePreview ? (
                                <img
                                    src={mobilePreview}
                                    alt="Mobile banner preview"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <button
                                    type="button"
                                    onClick={() =>
                                        mobileInputRef.current?.click()
                                    }
                                    className="flex h-full w-full flex-col items-center justify-center border border-dashed border-lyra-border text-lyra-muted transition-colors hover:border-lyra-black hover:text-lyra-black"
                                >
                                    <span className="text-2xl">
                                        +
                                    </span>

                                    <span className="mt-2 text-[10px] uppercase tracking-[0.16em]">
                                        Choose Mobile Image
                                    </span>
                                </button>
                            )}
                        </div>

                        {mobileFile && (
                            <button
                                type="button"
                                onClick={() =>
                                    mobileInputRef.current?.click()
                                }
                                className="mt-3 text-[10px] uppercase tracking-[0.14em] text-lyra-muted transition-colors hover:text-lyra-black"
                            >
                                Replace Image
                            </button>
                        )}

                        <input
                            ref={mobileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleMobileFileChange}
                            className="hidden"
                        />
                    </div>
                </div>
            </section>

            {/* ================================
                Basic Information
            ================================= */}
            <section className="border border-lyra-border bg-lyra-white">
                <div className="border-b border-lyra-border px-6 py-5">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-lyra-subtle">
                        Content
                    </p>

                    <h2 className="mt-1 font-display text-xl tracking-tight text-lyra-black">
                        Basic Information
                    </h2>
                </div>

                <div className="space-y-6 p-6">
                    <div>
                        <label
                            htmlFor="title"
                            className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-lyra-muted"
                        >
                            Title
                        </label>

                        <input
                            id="title"
                            value={title}
                            onChange={(event) =>
                                setTitle(event.target.value)
                            }
                            placeholder="A new season begins"
                            className="w-full border border-lyra-border bg-transparent px-4 py-3 text-sm transition-colors focus:border-lyra-black focus-visible:outline-2 focus-visible:outline-lyra-black focus-visible:outline-offset-2"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="subtitle"
                            className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-lyra-muted"
                        >
                            Subtitle
                        </label>

                        <textarea
                            id="subtitle"
                            value={subtitle}
                            onChange={(event) =>
                                setSubtitle(event.target.value)
                            }
                            placeholder="Discover effortless pieces designed for the modern wardrobe."
                            rows={4}
                            className="w-full resize-none border border-lyra-border bg-transparent px-4 py-3 text-sm leading-6 outline-none transition-colors focus:border-lyra-black"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="imageAlt"
                            className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-lyra-muted"
                        >
                            Image Alt Text
                        </label>

                        <input
                            id="imageAlt"
                            value={imageAlt}
                            onChange={(event) =>
                                setImageAlt(event.target.value)
                            }
                            placeholder="LYRA Fashion new season collection"
                            className="w-full border border-lyra-border bg-transparent px-4 py-3 text-sm transition-colors focus:border-lyra-black focus-visible:outline-2 focus-visible:outline-lyra-black focus-visible:outline-offset-2"
                        />

                        <p className="mt-2 text-xs text-lyra-muted">
                            Used for accessibility and SEO.
                        </p>
                    </div>
                </div>
            </section>

            {/* ================================
                CTA
            ================================= */}
            <section className="border border-lyra-border bg-lyra-white">
                <div className="border-b border-lyra-border px-6 py-5">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-lyra-subtle">
                        Action
                    </p>

                    <h2 className="mt-1 font-display text-xl tracking-tight text-lyra-black">
                        Call To Action
                    </h2>
                </div>

                <div className="grid gap-6 p-6 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="ctaLabel"
                            className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-lyra-muted"
                        >
                            Button Label
                        </label>

                        <input
                            id="ctaLabel"
                            value={ctaLabel}
                            onChange={(event) =>
                                setCtaLabel(event.target.value)
                            }
                            placeholder="Shop New Arrivals"
                            className="w-full border border-lyra-border bg-transparent px-4 py-3 text-sm transition-colors focus:border-lyra-black focus-visible:outline-2 focus-visible:outline-lyra-black focus-visible:outline-offset-2"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="ctaHref"
                            className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-lyra-muted"
                        >
                            Button Link
                        </label>

                        <input
                            id="ctaHref"
                            value={ctaHref}
                            onChange={(event) =>
                                setCtaHref(event.target.value)
                            }
                            placeholder="/collections"
                            className="w-full border border-lyra-border bg-transparent px-4 py-3 text-sm transition-colors focus:border-lyra-black focus-visible:outline-2 focus-visible:outline-lyra-black focus-visible:outline-offset-2"
                        />
                    </div>
                </div>
            </section>

            {/* ================================
                Scheduling
            ================================= */}
            <section className="border border-lyra-border bg-lyra-white">
                <div className="border-b border-lyra-border px-6 py-5">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-lyra-subtle">
                        Visibility
                    </p>

                    <h2 className="mt-1 font-display text-xl tracking-tight text-lyra-black">
                        Scheduling
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-lyra-muted">
                        Leave both fields empty to keep the banner available
                        without a schedule.
                    </p>
                </div>

                <div className="grid gap-6 p-6 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="startAt"
                            className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-lyra-muted"
                        >
                            Start Date
                        </label>

                        <input
                            id="startAt"
                            type="datetime-local"
                            value={startAt}
                            onChange={(event) =>
                                setStartAt(event.target.value)
                            }
                            className="w-full border border-lyra-border bg-transparent px-4 py-3 text-sm transition-colors focus:border-lyra-black focus-visible:outline-2 focus-visible:outline-lyra-black focus-visible:outline-offset-2"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="endAt"
                            className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-lyra-muted"
                        >
                            End Date
                        </label>

                        <input
                            id="endAt"
                            type="datetime-local"
                            value={endAt}
                            onChange={(event) =>
                                setEndAt(event.target.value)
                            }
                            className="w-full border border-lyra-border bg-transparent px-4 py-3 text-sm transition-colors focus:border-lyra-black focus-visible:outline-2 focus-visible:outline-lyra-black focus-visible:outline-offset-2"
                        />
                    </div>
                </div>
            </section>

            {/* ================================
                Error
            ================================= */}
            {error && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}

                    {createdBannerId && (
                        <div className="mt-3">
                            <Link
                                href={`/admin/homepage/${createdBannerId}/edit`}
                                className="text-[10px] uppercase tracking-[0.14em] underline underline-offset-4"
                            >
                                Open Draft Banner
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {/* ================================
                Actions
            ================================= */}
            <div className="flex flex-col-reverse gap-3 border-t border-lyra-border pt-6 sm:flex-row sm:items-center sm:justify-end">
                <Link
                    href="/admin/homepage"
                    className="inline-flex h-11 items-center justify-center border border-lyra-border px-6 text-[10px] uppercase tracking-[0.16em] text-lyra-black transition-colors hover:border-lyra-black"
                >
                    Cancel
                </Link>

                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex h-11 items-center justify-center bg-lyra-black px-7 text-[10px] uppercase tracking-[0.16em] text-lyra-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isPending
                        ? "Creating Banner..."
                        : "Create Hero Banner"}
                </button>
            </div>
        </form>
    );
}