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
import { Loader2, Star, Trash2, GripVertical } from "lucide-react";
import { useState, useEffect } from "react";

import { reorderAdminProductImages } from "@/lib/actions/admin-media.actions";

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
}: {
    image: ProductImage;
    isPrimary: boolean;
    onDelete: (imageId: string) => void;
    isDeleting: boolean;
    isDeletingImageId?: string | null;
}) {
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
                {...listeners}
                aria-label={`Drag ${image.alt ?? "product image"}`}
                className="absolute bottom-2 left-2 flex h-9 w-9 cursor-grab items-center justify-center bg-white/90 text-lyra-black shadow-sm active:cursor-grabbing"
            >
                <GripVertical className="h-4 w-4" />
            </button>

            <button
                type="button"
                onClick={() => onDelete(image.id)}
                disabled={isDeleting}
                aria-label={`Delete ${image.alt ?? "product image"}`}
                className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center bg-white/90 text-lyra-black shadow-sm transition hover:bg-lyra-black hover:text-lyra-white disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Trash2 className="h-4 w-4" />
                )}
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

            <div className="flex items-center justify-between border-t border-lyra-border pt-4">
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