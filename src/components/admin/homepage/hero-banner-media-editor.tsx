"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    ImagePlus,
    Monitor,
    Smartphone,
    Upload,
    Trash2,
} from "lucide-react";

import {
    deleteHeroBannerDesktopImage,
    deleteHeroBannerMobileImage,
    uploadHeroBannerImage,
} from "@/lib/actions/admin-hero-media.actions";

type HeroBannerMediaEditorProps = {
    heroBannerId: string;
    desktopImageUrl: string | null;
    mobileImageUrl: string | null;
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

export function HeroBannerMediaEditor({
    heroBannerId,
    desktopImageUrl,
    mobileImageUrl,
}: HeroBannerMediaEditorProps) {
    const router = useRouter();

    const desktopInputRef = useRef<HTMLInputElement>(null);
    const mobileInputRef = useRef<HTMLInputElement>(null);

    const [desktopFile, setDesktopFile] = useState<File | null>(null);
    const [mobileFile, setMobileFile] = useState<File | null>(null);

    const [desktopPreview, setDesktopPreview] = useState<string | null>(
        desktopImageUrl,
    );

    const [mobilePreview, setMobilePreview] = useState<string | null>(
        mobileImageUrl,
    );

    const [uploadingVariant, setUploadingVariant] = useState<
        "desktop" | "mobile" | null
    >(null);

    const [isDeletingDesktop, setIsDeletingDesktop] = useState(false);
    const [isDeletingMobile, setIsDeletingMobile] = useState(false);

    const [error, setError] = useState<string | null>(null);

    function validateFile(file: File) {
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            return "Only JPG, PNG and WebP images are allowed.";
        }

        if (file.size > MAX_IMAGE_SIZE) {
            return "Image size must be less than 5MB.";
        }

        return null;
    }

    function handleFileSelect(
        variant: "desktop" | "mobile",
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        const file = event.target.files?.[0];

        setError(null);

        if (!file) {
            return;
        }

        const validationError = validateFile(file);

        if (validationError) {
            setError(validationError);
            return;
        }

        const previewUrl = URL.createObjectURL(file);

        if (variant === "desktop") {
            setDesktopFile(file);
            setDesktopPreview(previewUrl);
        } else {
            setMobileFile(file);
            setMobilePreview(previewUrl);
        }
    }

    function handleChooseImage(variant: "desktop" | "mobile") {
        if (variant === "desktop") {
            desktopInputRef.current?.click();
        } else {
            mobileInputRef.current?.click();
        }
    }

    async function handleUpload(variant: "desktop" | "mobile") {
        const file =
            variant === "desktop"
                ? desktopFile
                : mobileFile;

        if (!file || uploadingVariant) {
            return;
        }

        setError(null);
        setUploadingVariant(variant);

        try {
            await uploadHeroBannerImage(
                heroBannerId,
                variant,
                file,
            );

            if (variant === "desktop") {
                setDesktopFile(null);

                if (desktopInputRef.current) {
                    desktopInputRef.current.value = "";
                }
            } else {
                setMobileFile(null);

                if (mobileInputRef.current) {
                    mobileInputRef.current.value = "";
                }
            }

            router.refresh();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to upload image.",
            );
        } finally {
            setUploadingVariant(null);
        }
    }

    async function handleRemoveDesktopImage() {
        if (isDeletingDesktop) {
            return;
        }

        const confirmed = window.confirm(
            "Removing the desktop image will deactivate this hero banner. Continue?",
        );

        if (!confirmed) {
            return;
        }

        setError(null);
        setIsDeletingDesktop(true);

        try {
            await deleteHeroBannerDesktopImage(heroBannerId);

            setDesktopPreview(null);
            setDesktopFile(null);

            if (desktopInputRef.current) {
                desktopInputRef.current.value = "";
            }

            router.refresh();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to remove desktop image.",
            );
        } finally {
            setIsDeletingDesktop(false);
        }
    }

    async function handleDeleteMobile() {
        if (isDeletingMobile) {
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to remove the mobile image?",
        );

        if (!confirmed) {
            return;
        }

        setError(null);
        setIsDeletingMobile(true);

        try {
            await deleteHeroBannerMobileImage(heroBannerId);

            setMobilePreview(null);
            setMobileFile(null);

            if (mobileInputRef.current) {
                mobileInputRef.current.value = "";
            }

            router.refresh();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to remove mobile image.",
            );
        } finally {
            setIsDeletingMobile(false);
        }
    }

    return (
        <section className="space-y-5 border-t border-lyra-border pt-8">
            <div>
                <h2 className="font-display text-2xl text-lyra-black">
                    Hero Media
                </h2>

                <p className="mt-1 text-sm text-lyra-muted">
                    Upload dedicated desktop and mobile images for this hero
                    banner.
                </p>
            </div>

            {/* Media Cards */}
            <div className="grid gap-5 lg:grid-cols-2">
                {/* Desktop */}
                <div className="border border-lyra-border bg-lyra-white p-5">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center bg-lyra-cream">
                            <Monitor
                                className="h-4 w-4 text-lyra-black"
                                strokeWidth={1.5}
                            />
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-lyra-black">
                                Desktop Image
                            </h3>

                            <p className="text-xs text-lyra-muted">
                                Required
                            </p>
                        </div>
                    </div>

                    <div className="relative aspect-16/7 overflow-hidden border border-lyra-border bg-lyra-cream">
                        {desktopPreview ? (
                            <Image
                                src={desktopPreview}
                                alt="Desktop hero preview"
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center text-center">
                                <ImagePlus className="h-8 w-8 text-lyra-subtle" />

                                <p className="mt-3 text-sm text-lyra-muted">
                                    No desktop image uploaded
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                handleChooseImage("desktop")
                            }
                            className="inline-flex items-center gap-2 border border-lyra-black bg-lyra-black px-4 py-2.5 text-xs font-medium text-lyra-white transition hover:bg-transparent hover:text-lyra-black"
                        >
                            <Upload className="h-4 w-4" />
                            {desktopPreview
                                ? "Replace Image"
                                : "Choose Image"}
                        </button>

                        {desktopFile && (
                            <button
                                type="button"
                                onClick={() =>
                                    handleUpload("desktop")
                                }
                                disabled={uploadingVariant !== null}
                                className="border border-lyra-border px-4 py-2.5 text-xs font-medium text-lyra-black transition hover:border-lyra-black disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {uploadingVariant === "desktop"
                                    ? "Uploading..."
                                    : "Upload Selected"}
                            </button>
                        )}

                        {desktopPreview && !desktopFile && (
                            <button
                                type="button"
                                onClick={handleRemoveDesktopImage}
                                disabled={isDeletingDesktop}
                                className="inline-flex items-center gap-2 border border-lyra-border px-4 py-2.5 text-xs font-medium text-lyra-muted transition hover:border-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Trash2 className="h-4 w-4" />
                                {isDeletingDesktop
                                    ? "Removing..."
                                    : "Remove"}
                            </button>
                        )}
                    </div>

                    <input
                        ref={desktopInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(event) =>
                            handleFileSelect("desktop", event)
                        }
                        className="hidden"
                    />

                    <p className="mt-3 text-xs text-lyra-subtle">
                        JPG, PNG or WebP · Maximum 5MB
                    </p>
                </div>

                {/* Mobile */}
                <div className="border border-lyra-border bg-lyra-white p-5">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center bg-lyra-cream">
                            <Smartphone
                                className="h-4 w-4 text-lyra-black"
                                strokeWidth={1.5}
                            />
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-lyra-black">
                                Mobile Image
                            </h3>

                            <p className="text-xs text-lyra-muted">
                                Optional
                            </p>
                        </div>
                    </div>

                    <div className="relative aspect-4/5 overflow-hidden border border-lyra-border bg-lyra-cream">
                        {mobilePreview ? (
                            <Image
                                src={mobilePreview}
                                alt="Mobile hero preview"
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center text-center">
                                <ImagePlus className="h-8 w-8 text-lyra-subtle" />

                                <p className="mt-3 text-sm text-lyra-muted">
                                    No mobile image uploaded
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                handleChooseImage("mobile")
                            }
                            className="inline-flex items-center gap-2 border border-lyra-black bg-lyra-black px-4 py-2.5 text-xs font-medium text-lyra-white transition hover:bg-transparent hover:text-lyra-black"
                        >
                            <Upload className="h-4 w-4" />
                            {mobilePreview
                                ? "Replace Image"
                                : "Choose Image"}
                        </button>

                        {mobileFile && (
                            <button
                                type="button"
                                onClick={() =>
                                    handleUpload("mobile")
                                }
                                disabled={uploadingVariant !== null}
                                className="border border-lyra-border px-4 py-2.5 text-xs font-medium text-lyra-black transition hover:border-lyra-black disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {uploadingVariant === "mobile"
                                    ? "Uploading..."
                                    : "Upload Selected"}
                            </button>
                        )}

                        {mobilePreview && !mobileFile && (
                            <button
                                type="button"
                                onClick={handleDeleteMobile}
                                disabled={isDeletingMobile}
                                className="inline-flex items-center gap-2 border border-lyra-border px-4 py-2.5 text-xs font-medium text-lyra-muted transition hover:border-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Trash2 className="h-4 w-4" />
                                {isDeletingMobile
                                    ? "Removing..."
                                    : "Remove"}
                            </button>
                        )}
                    </div>

                    <input
                        ref={mobileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(event) =>
                            handleFileSelect("mobile", event)
                        }
                        className="hidden"
                    />

                    <p className="mt-3 text-xs text-lyra-subtle">
                        JPG, PNG or WebP · Maximum 5MB
                    </p>
                </div>
            </div>

            {error && (
                <p className="text-sm text-red-600">
                    {error}
                </p>
            )}
        </section>
    );
}