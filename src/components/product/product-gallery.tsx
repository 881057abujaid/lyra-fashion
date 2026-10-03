"use client";

import Image from "next/image";
import { useState } from "react";

type ProductGalleryImage = {
    url: string;
    alt: string | null;
};

type ProductGalleryProps = {
    images: ProductGalleryImage[];
    name: string;
};

export function ProductGallery({
    images,
    name,
}: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    if (!images.length) {
        return (
            <div className="aspect-3/4 bg-lyra-beige" />
        );
    }

    const selectedImageData = images[selectedImage];

    return (
        <div className="space-y-3">
            {/* Main Image */}
            <div className="relative aspect-3/4 overflow-hidden bg-lyra-beige">
                <Image
                    key={selectedImageData.url}
                    src={selectedImageData.url}
                    alt={
                        selectedImageData.alt ??
                        `${name} ${selectedImage + 1}`
                    }
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-opacity duration-500"
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                    {images.map((image, index) => {
                        const isSelected = index === selectedImage;

                        return (
                            <button
                                key={`${image.url}-${index}`}
                                type="button"
                                onClick={() => setSelectedImage(index)}
                                aria-label={`View image ${index + 1}`}
                                aria-pressed={isSelected}
                                className={`relative h-24 w-20 shrink-0 overflow-hidden bg-lyra-beige transition-opacity ${isSelected
                                    ? "opacity-100"
                                    : "opacity-55 hover:opacity-85"
                                    }`}
                            >
                                <Image
                                    src={image.url}
                                    alt=""
                                    fill
                                    sizes="80px"
                                    className="object-cover"
                                />

                                {isSelected && (
                                    <span className="absolute inset-0 border-2 border-lyra-black" />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}