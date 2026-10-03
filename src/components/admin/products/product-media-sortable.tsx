"use client";

import {
    closestCenter,
    DndContext,
    type DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    rectSortingStrategy,
    SortableContext,
    useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { Loader2, Star, Trash2, GripVertical, Check } from "lucide-react";
import { useState, useEffect } from "react";

import { reorderAdminProductImages, updateAdminProductImageAlt } from "@/lib/actions/admin-media.actions";

type ProductImage = {
    id: string;
    url: string;
    publicId: string;
    alt: string | null;
    sortOrder: number;
};

type ProductMediaSortableProps = {
    productId: string;
    images: ProductImage[];
    onDelete: (imageId: string) => void;
    isDeletingImageId?: string | null;
};

function SortableImage({
    image,
    isPrimary,
    onDelete,
    isDeleting,
    isDeletingImageId,
    onAltSave,
}: {
    image: ProductImage;
    isPrimary: boolean;
    onDelete: (imageId: string) => void;
    isDeleting: boolean;
    isDeletingImageId?: string | null;
    onAltSave: (imageId: string, alt: string) => Promise<void>;
}) {
    const [alt, setAlt] = useState(image.alt ?? "");
    const [isSavingAlt, setIsSavingAlt] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: image.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative overflow-hidden border border-lyra-border bg-lyra-white ${isDragging ? "z-10 opacity-70 shadow-xl" : ""
                }`}
            {...attributes}
        >
            <div className="relative aspect-square">
                <Image
                    src={image.url}
                    alt={image.alt ?? "Product image"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
            </div>

            {isPrimary && (
                <div className="absolute left-2 top-2 flex items-center gap-1 bg-lyra-black px-2.5 py-1 text-xs font-medium text-lyra-white">
                    <Star className="h-3 w-3 fill-current" />
                    Primary
                </div>
            )}

            <button
                type="button"
                onClick={() => onDelete(image.id)}
                disabled={isDeleting}
                aria-label={`Delete ${image.alt ?? "product image"}`}
                className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center bg-lyra-white/90 text-lyra-black shadow-sm transition hover:bg-lyra-black hover:text-lyra-white disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Trash2 className="h-4 w-4" />
                )}
            </button>

            <div className="border-t border-lyra-border bg-lyra-white p-3">
                <label
                    htmlFor={`alt-${image.id}`}
                    className="mb-1.5 block text-xs font-medium text-lyra-black"
                >
                    Alt Text
                </label>

                <div className="flex gap-2">
                    <input
                        id={`alt-${image.id}`}
                        type="text"
                        value={alt}
                        onChange={(event) => setAlt(event.target.value)}
                        maxLength={200}
                        placeholder="Describe this image"
                        className="min-w-0 flex-1 border border-lyra-border bg-lyra-cream px-3 py-2 text-xs text-lyra-black transition focus:border-lyra-black focus-visible:outline-2 focus-visible:outline-lyra-black focus-visible:outline-offset-2"
                    />

                    <button
                        type="button"
                        disabled={isSavingAlt}
                        onClick={async () => {
                            setIsSavingAlt(true);

                            try {
                                await onAltSave(image.id, alt);
                            } finally {
                                setIsSavingAlt(false);
                            }
                        }}
                        aria-label="Save alt text"
                        className="flex h-9 w-9 shrink-0 items-center justify-center border border-lyra-black bg-lyra-black text-lyra-white transition hover:text-lyra-black hover:bg-transparent disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSavingAlt ? (
                            <Loader2 className="h-2 w-4 animate-spin" />
                        ) : (
                            <Check className="h-4 w-4" />
                        )}
                    </button>
                </div>

                <p className="mt-1 text-right text-[10px] text-lyra-subtle">
                    {alt.length}/200
                </p>
            </div>

            <button
                type="button"
                {...listeners}
                aria-label={`Drag ${image.alt ?? "product image"}`}
                className="flex h-10 w-full cursor-grab items-center justify-center border-t border-lyra-border bg-lyra-cream text-lyra-muted transition hover:bg-lyra-beige hover:text-lyra-black active:cursor-grabbing"
            >
                <div className="flex items-center justify-center gap-2">
                    <GripVertical className="h-4 w-4" />
                    <span className="text-[10px] font-medium uppercase tracking-[0.15em]">
                        Drag to reorder
                    </span>
                </div>
            </button>
        </div>
    );
}

export function ProductMediaSortable({
    productId,
    images,
    onDelete,
    isDeletingImageId,
}: ProductMediaSortableProps & {
    isDeletingImageId?: string | null;
}) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [localImages, setLocalImages] = useState(() =>
        [...images].sort((a, b) => a.sortOrder - b.sortOrder),
    );

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        setLocalImages((currentImages) => {
            const oldIndex = currentImages.findIndex(
                (image) => image.id === active.id,
            );

            const newIndex = currentImages.findIndex(
                (image) => image.id === over.id,
            );

            if (oldIndex === -1 || newIndex === -1) {
                return currentImages;
            }

            return arrayMove(currentImages, oldIndex, newIndex);
        });
    }

    async function handleAltSave(imageId: string, alt: string) {
        setError(null);

        try {
            await updateAdminProductImageAlt(productId, imageId, alt);

            setLocalImages((currentImages) =>
                currentImages.map((image) =>
                    image.id === imageId
                        ? {
                            ...image,
                            alt: alt.trim() || null,
                        }
                        : image,
                ),
            );
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to save alt text.");
            throw error;
        }
    }

    async function handleSaveOrder() {
        setError(null);
        setIsSaving(true);

        try {
            await reorderAdminProductImages(
                productId,
                localImages.map((image) => image.id),
            );
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to save image order.",
            );
        } finally {
            setIsSaving(false);
        }
    }

    if (!isMounted) {
        return (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {images.map((image) => (
                    <div
                        key={image.id}
                        className="relative aspect-square overflow-hidden border border-lyra-border bg-lyra-white"
                    >
                        <Image
                            src={image.url}
                            alt={image.alt ?? "Product image"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={localImages.map((image) => image.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {localImages.map((image, index) => (
                            <SortableImage
                                key={image.id}
                                image={image}
                                isPrimary={index === 0}
                                onDelete={onDelete}
                                isDeleting={
                                    isDeletingImageId === image.id
                                }
                                onAltSave={handleAltSave}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {error && (
                <p className="text-sm text-red-600">
                    {error}
                </p>
            )}

            <div className="flex flex-col gap-3 border-t border-lyra-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-lyra-muted">
                    Drag images to change their order. The first image is
                    automatically the primary image.
                </p>

                <button
                    type="button"
                    onClick={handleSaveOrder}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 border border-lyra-black bg-lyra-black px-5 py-2.5 text-sm font-medium text-lyra-white transition hover:bg-transparent hover:text-lyra-black disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSaving && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    )}

                    {isSaving ? "Saving..." : "Save Order"}
                </button>
            </div>
        </div>
    );
}