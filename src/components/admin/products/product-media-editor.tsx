"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    ImagePlus,
    Loader2,
    Star,
    Trash2,
    Upload,
} from "lucide-react";

import {
    deleteAdminProductImage,
    uploadAdminProductImage,
} from "@/lib/actions/admin-media.actions";
import { ProductMediaSortable } from "./product-media-sortable";

type ProductMediaEditorProps = {
    productId: string;
    images: {
        id: string;
        url: string;
        publicId: string;
        alt: string | null;
        sortOrder: number;
    }[];
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

export function ProductMediaEditor({
    productId,
    images,
}: ProductMediaEditorProps) {
    const router = useRouter();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [deletingImageId, setDeletingImageId] = useState<string | null>(
        null,
    );
    const [error, setError] = useState<string | null>(null);

    function handleFileSelect(
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        const file = event.target.files?.[0];

        setError(null);
        setSelectedFile(null);

        if (!file) {
            return;
        }

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            setError("Only JPG, PNG and WebP images are allowed.");
            return;
        }

        if (file.size > MAX_IMAGE_SIZE) {
            setError("Image size must be less than 5MB.");
            return;
        }

        setSelectedFile(file);
    }

    function handleChooseImage() {
        fileInputRef.current?.click();
    }

    async function handleUpload() {
        if (!selectedFile || isUploading) return;

        setError(null);
        setIsUploading(true);

        try {
            await uploadAdminProductImage(productId, selectedFile);

            setSelectedFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            router.refresh();
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to upload image.");
        } finally {
            setIsUploading(false);
        }
    }

    async function handleDelete(imageId: string) {
        if (deletingImageId) return;

        const confirmed = window.confirm("Are you sure you want to delete this image?",);

        if (!confirmed) return;

        setError(null);
        setDeletingImageId(imageId);

        try {
            await deleteAdminProductImage(productId, imageId);

            router.refresh();
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to delete image.");
        } finally {
            setDeletingImageId(null);
        }
    }

    return (
        <section className="space-y-5 border-t border-lyra-border pt-8">
            <div>
                <h2 className="font-display text-2xl text-lyra-black">
                    Product Media
                </h2>

                <p className="mt-1 text-sm text-lyra-muted">
                    Manage product images and choose the primary image.
                </p>
            </div>

            {/* Existing Images */}
            {images.length === 0 ? (
                <div className="flex min-h-48 items-center justify-center border border-dashed border-lyra-border bg-lyra-white">
                    <div className="text-center">
                        <ImagePlus className="mx-auto h-8 w-8 text-lyra-subtle" />

                        <p className="mt-3 text-sm text-lyra-muted">
                            No product images uploaded yet.
                        </p>
                    </div>
                </div>
            ) : (
                <ProductMediaSortable
                    productId={productId}
                    images={images}
                    onDelete={handleDelete}
                    isDeletingImageId={deletingImageId}
                />
            )}

            {/* Upload Area */}
            <div className="border border-lyra-border bg-lyra-white p-5">
                <div className="flex flex-col items-center justify-center border border-dashed border-lyra-border px-6 py-10 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lyra-cream">
                        <Upload className="h-5 w-5 text-lyra-black" />
                    </div>

                    <h3 className="mt-4 text-sm font-medium text-lyra-black">
                        Add product image
                    </h3>

                    <p className="mt-1 text-xs text-lyra-muted">
                        JPG, PNG or WebP · Maximum 5MB
                    </p>

                    <button
                        type="button"
                        onClick={handleChooseImage}
                        className="mt-5 inline-flex items-center gap-2 border border-lyra-black bg-lyra-black px-5 py-2.5 text-sm font-medium text-lyra-white transition hover:bg-transparent hover:text-lyra-black"
                    >
                        <Upload className="h-4 w-4" />
                        Choose Image
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>

                {/* Validation Error */}
                {error && (
                    <p className="mt-3 text-sm text-red-600">
                        {error}
                    </p>
                )}

                {/* Selected File */}
                {selectedFile && !error && (
                    <div className="mt-4 flex items-center justify-between border border-lyra-border bg-lyra-cream px-4 py-3">
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-lyra-black">
                                {selectedFile.name}
                            </p>

                            <p className="mt-0.5 text-xs text-lyra-muted">
                                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={isUploading}
                            className="ml-4 shrink-0 border border-lyra-black bg-lyra-black px-4 py-2 text-xs font-medium text-lyra-white transition hover:bg-transparent hover:text-lyra-black disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isUploading ? "Uploading..." : "Upload Image"}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}