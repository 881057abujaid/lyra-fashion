import Image from "next/image";

type ProductGalleryProps = {
    images: string[];
    name: string;
};

export function ProductGallery({ images, name, }: ProductGalleryProps) {
    return (
        <div className="grid gap-3">
            {images.map((image, index) => (
                <div
                    key={`${image}-${index}`}
                    className="relative aspect-3/4 overflow-hidden bg-lyra-beige"
                >
                    <Image
                        src={image}
                        alt={`${name} ${index + 1}`}
                        fill
                        priority={index === 0}
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover"
                    />
                </div>
            ))}
        </div>
    );
}