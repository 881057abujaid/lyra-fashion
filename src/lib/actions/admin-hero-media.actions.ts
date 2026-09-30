"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/authorization";
import { cloudinary } from "@/lib/cloudinary";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
] as const;

type HeroImageVariant = "desktop" | "mobile";

export async function uploadHeroBannerImage(
    heroBannerId: string,
    variant: HeroImageVariant,
    file: File,
) {
    await requireAdmin();

    if (!heroBannerId) {
        throw new Error("Hero banner ID is required");
    }

    if (!file || file.size === 0) {
        throw new Error("No image was provided");
    }

    if (file.size > MAX_IMAGE_SIZE) {
        throw new Error("Image size must be less than 5MB");
    }

    if (
        !ALLOWED_IMAGE_TYPES.includes(
            file.type as (typeof ALLOWED_IMAGE_TYPES)[number],
        )
    ) {
        throw new Error("Only JPG, PNG and WebP images are allowed");
    }

    if (variant !== "desktop" && variant !== "mobile") {
        throw new Error("Invalid hero image variant");
    }

    const heroBanner = await prisma.heroBanner.findUnique({
        where: {
            id: heroBannerId,
        },
        select: {
            id: true,
            desktopImagePublicId: true,
            mobileImagePublicId: true,
        },
    });

    if (!heroBanner) {
        throw new Error("Hero banner not found");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadedImage = await new Promise<{
        secure_url: string;
        public_id: string;
    }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "lyra/hero-banners",
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

    const oldPublicId =
        variant === "desktop"
            ? heroBanner.desktopImagePublicId
            : heroBanner.mobileImagePublicId;

    try {
        const data =
            variant === "desktop"
                ? {
                    desktopImageUrl: uploadedImage.secure_url,
                    desktopImagePublicId: uploadedImage.public_id,
                }
                : {
                    mobileImageUrl: uploadedImage.secure_url,
                    mobileImagePublicId: uploadedImage.public_id,
                };

        const updatedBanner = await prisma.heroBanner.update({
            where: {
                id: heroBannerId,
            },
            data,
        });

        // DB successfully points to the new image.
        // Old image cleanup must not invalidate the successful update.
        if (oldPublicId) {
            try {
                await cloudinary.uploader.destroy(
                    oldPublicId,
                    {
                        resource_type: "image",
                    },
                );
            } catch (error) {
                console.error(
                    `Failed to delete old hero image from Cloudinary: ${oldPublicId}`,
                    error,
                );
            }
        }

        return {
            id: updatedBanner.id,
            variant,
            url:
                variant === "desktop"
                    ? updatedBanner.desktopImageUrl
                    : updatedBanner.mobileImageUrl,
            publicId:
                variant === "desktop"
                    ? updatedBanner.desktopImagePublicId
                    : updatedBanner.mobileImagePublicId,
        };
    } catch (error) {
        // DB update failed, so the newly uploaded asset is no longer needed.
        try {
            await cloudinary.uploader.destroy(
                uploadedImage.public_id,
                {
                    resource_type: "image",
                },
            );
        } catch (cleanupError) {
            console.error(
                `Failed to clean up uploaded hero image: ${uploadedImage.public_id}`,
                cleanupError,
            );
        }

        throw error;
    }
}

export async function deleteHeroBannerMobileImage(heroBannerId: string) {
    await requireAdmin();

    if (!heroBannerId) {
        throw new Error("Hero banner ID is required");
    }

    const heroBanner = await prisma.heroBanner.findUnique({
        where: {
            id: heroBannerId,
        },
        select: {
            id: true,
            mobileImagePublicId: true,
        },
    });

    if (!heroBanner) {
        throw new Error("Hero banner not found");
    }

    if (!heroBanner.mobileImagePublicId) {
        return {
            success: true,
        };
    }

    const cloudinaryResult = await new Promise<string>(
        (resolve, reject) => {
            cloudinary.uploader.destroy(
                heroBanner.mobileImagePublicId!,
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
        throw new Error("Failed to delete image from cloudinary");
    }

    await prisma.heroBanner.update({
        where: {
            id: heroBanner.id,
        },
        data: {
            mobileImageUrl: null,
            mobileImagePublicId: null,
        },
    });

    return {
        success: true,
    };
}

export async function deleteHeroBannerDesktopImage(heroBannerId: string) {
    await requireAdmin();

    if (!heroBannerId) {
        throw new Error("Hero banner ID is required");
    }

    const heroBanner = await prisma.heroBanner.findUnique({
        where: {
            id: heroBannerId,
        },
        select: {
            id: true,
            desktopImagePublicId: true,
            isActive: true,
        },
    });

    if (!heroBanner) {
        throw new Error("Hero banner not found");
    }

    if (!heroBanner.desktopImagePublicId) {
        return {
            success: true,
        };
    }

    const cloudinaryResult = await new Promise<string>(
        (resolve, reject) => {
            cloudinary.uploader.destroy(
                heroBanner.desktopImagePublicId!,
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

    await prisma.heroBanner.update({
        where: {
            id: heroBanner.id,
        },
        data: {
            desktopImageUrl: null,
            desktopImagePublicId: null,

            // A hero without a desktop image cannot remain active.
            isActive: false,
        },
    });

    return {
        success: true,
    };
}