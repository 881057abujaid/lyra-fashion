"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/authorization";
import { cloudinary } from "@/lib/cloudinary";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

export async function uploadAdminProductImage(
    productId: string,
    file: File,
) {
    await requireAdmin();

    if (!productId) {
        throw new Error("Product ID is required");
    }

    if (!file || file.size === 0) {
        throw new Error("No image was provided");
    }

    if (file.size > MAX_IMAGE_SIZE) {
        throw new Error("Image size must be less than 5MB");
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        throw new Error("Only JPG, PNG and WebP images are allowed");
    }

    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },
        select: {
            id: true,
        },
    });

    if (!product) {
        throw new Error("Product not found");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadedImage = await new Promise<{
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

    try {
        const lastImage = await prisma.productImages.findFirst({
            where: {
                productId,
            },
            orderBy: {
                sortOrder: "desc",
            },
            select: {
                sortOrder: true,
            },
        });

        const sortOrder = lastImage
            ? lastImage.sortOrder + 1
            : 0;

        const image = await prisma.productImages.create({
            data: {
                productId,
                url: uploadedImage.secure_url,
                publicId: uploadedImage.public_id,
                sortOrder,
            },
        });

        return {
            id: image.id,
            url: image.url,
            publicId: image.publicId,
            alt: image.alt,
            sortOrder: image.sortOrder,
        };
    } catch (error) {
        await cloudinary.uploader.destroy(
            uploadedImage.public_id,
            {
                resource_type: "image",
            },
        );

        throw error;
    }
}

export async function deleteAdminProductImage(
    productId: string,
    imageId: string,
) {
    await requireAdmin();

    if (!productId) {
        throw new Error("Product ID is required");
    }

    if (!imageId) {
        throw new Error("Image ID is required");
    }

    const image = await prisma.productImages.findFirst({
        where: {
            id: imageId,
            productId,
        },
        select: {
            id: true,
            publicId: true,
        },
    });

    if (!image) {
        throw new Error("Product image not found");
    }

    const remainingImages = await prisma.productImages.findMany({
        where: {
            productId,
            id: {
                not: imageId,
            },
        },
        orderBy: {
            sortOrder: "asc",
        },
        select: {
            id: true,
        },
    });

    const isDeletingPrimary =
        (
            await prisma.productImages.findUnique({
                where: {
                    id: imageId,
                },
                select: {
                    sortOrder: true,
                },
            })
        )?.sortOrder === 0;

    const cloudinaryResult = await new Promise<string>(
        (resolve, reject) => {
            cloudinary.uploader.destroy(
                image.publicId,
                {
                    resource_type: "image",
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve(result?.result ?? "unknown");
                },
            );
        },
    );

    if (
        cloudinaryResult !== "ok" &&
        cloudinaryResult !== "not found"
    ) {
        throw new Error("Failed to delete image from Cloudinary");
    }

    await prisma.$transaction(async (tx) => {
        await tx.productImages.delete({
            where: {
                id: image.id,
            },
        });

        if (isDeletingPrimary) {
            for (const [index, remainingImage] of remainingImages.entries()) {
                await tx.productImages.update({
                    where: {
                        id: remainingImage.id,
                    },
                    data: {
                        sortOrder: index,
                    },
                });
            }
        } else {
            const remainingImagesAfterDelete =
                await tx.productImages.findMany({
                    where: {
                        productId,
                    },
                    orderBy: {
                        sortOrder: "asc",
                    },
                    select: {
                        id: true,
                    },
                });

            for (const [
                index,
                remainingImage,
            ] of remainingImagesAfterDelete.entries()) {
                await tx.productImages.update({
                    where: {
                        id: remainingImage.id,
                    },
                    data: {
                        sortOrder: index,
                    },
                });
            }
        }
    });

    return {
        success: true,
    };
}

export async function reorderAdminProductImages(
    productId: string,
    imageIds: string[],
) {
    await requireAdmin();

    if (!productId) {
        throw new Error("Product ID is required");
    }

    if (imageIds.length === 0) {
        return { success: true };
    }

    const uniqueImageIds = new Set(imageIds);

    if (uniqueImageIds.size !== imageIds.length) {
        throw new Error("Duplicate image IDs are not allowed");
    }

    const productImages = await prisma.productImages.findMany({
        where: {
            productId,
        },
        select: {
            id: true,
        },
    });

    const existingImageIds = new Set(
        productImages.map((image) => image.id),
    );

    if (imageIds.length !== productImages.length) {
        throw new Error("Invalid image order");
    }

    for (const imageId of imageIds) {
        if (!existingImageIds.has(imageId)) {
            throw new Error("Invalid product image");
        }
    }

    await prisma.$transaction(
        imageIds.map((imageId, index) => prisma.productImages.update({
            where: {
                id: imageId,
            },
            data: {
                sortOrder: index,
            },
        })),
    );

    return {
        success: true,
    };
}