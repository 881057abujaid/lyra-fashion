"use server";

import { requireAdmin } from "@/lib/auth/authorization";
import { cloudinary } from "@/lib/cloudinary";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

export async function uploadAdminProductImage(file: File) {
    await requireAdmin();

    if (!file || file.size === 0) {
        throw new Error("No image was provided");
    }

    if (file.size > MAX_IMAGE_SIZE) {
        throw new Error("Image size must be less than 5MB");
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        throw new Error(
            "Only JPG, PNG and WebP images are allowed",
        );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<{
        secure_url: string;
        public_id: string;
    }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "lyra/products",
                resource_type: "image",
            },
            (error, result) => {
                if (error || !result) {
                    reject(
                        error ?? new Error("Cloudinary upload failed"),
                    );
                    return;
                }

                resolve({
                    secure_url: result.secure_url,
                    public_id: result.public_id,
                });
            },
        );

        uploadStream.end(buffer);
    });

    return {
        url: result.secure_url,
        publicId: result.public_id,
    };
}