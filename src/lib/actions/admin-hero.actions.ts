"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { cloudinary } from "@/lib/cloudinary";
import { requireAdmin } from "../auth/authorization";
import {
    createHeroBanner,
    getHeroBannerById,
    updateHeroBanner,
    deleteHeroBanner,
    toggleHeroBanner,
    reorderHeroBanners,
} from "../data/hero-banners";

const createHeroBannerSchema = z.object({
    title: z.string().trim().max(200).optional(),
    subtitle: z.string().trim().max(500).optional(),

    desktopImageUrl: z.string().url().optional(),
    desktopImagePublicId: z.string().min(1).optional(),

    mobileImageUrl: z.string().url().optional(),
    mobileImagePublicId: z.string().min(1).optional(),

    imageAlt: z.string().trim().min(1).max(200),

    ctaLabel: z.string().trim().max(50).optional(),
    ctaHref: z.string().trim().max(500).optional(),

    sortOrder: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),

    startAt: z.coerce.date().optional(),
    endAt: z.coerce.date().optional(),
});

const updateHeroBannerSchema = z.object({
    id: z.string().min(1),

    title: z.string().trim().max(200).optional(),
    subtitle: z.string().trim().max(500).optional(),

    imageAlt: z.string().trim().min(1).max(200).optional(),

    ctaLabel: z.string().trim().max(50).optional(),
    ctaHref: z.string().trim().max(500).optional(),

    startAt: z.coerce.date().nullable().optional(),
    endAt: z.coerce.date().nullable().optional(),

    isActive: z.boolean().optional(),
});

const deleteHeroBannerSchema = z.object({
    id: z.string().min(1),
});

const toggleHeroBannerSchema = z.object({
    id: z.string().min(1),
    isActive: z.boolean(),
});

const reorderHeroBannersSchema = z.object({
    ids: z
        .array(z.string().min(1))
        .min(1),
});

async function ensureHeroBannerCanBeActive(id: string) {
    const banner = await getHeroBannerById(id);

    if (!banner) {
        throw new Error("Hero banner not found");
    }

    if (!banner.desktopImageUrl) {
        throw new Error(
            "A desktop image is required before activating this hero banner",
        );
    }

    return banner;
}

export async function createHeroBannerAction(
    input: z.infer<typeof createHeroBannerSchema>,
) {
    await requireAdmin();

    const validatedData = createHeroBannerSchema.parse(input);

    if (
        validatedData.startAt &&
        validatedData.endAt &&
        validatedData.startAt >= validatedData.endAt
    ) {
        throw new Error("End date must be after start date");
    }

    if (
        Boolean(validatedData.desktopImageUrl) !== Boolean(validatedData.desktopImagePublicId)
    ) {
        throw new Error("Desktop image URL and public ID must be provided together");
    }

    const banner = await createHeroBanner({
        ...validatedData,
        sortOrder: validatedData.sortOrder ?? 0,
        isActive: validatedData.isActive ?? false,
    });

    revalidatePath("/admin");
    revalidatePath("/admin/homepage");
    revalidatePath("/");

    return banner;
}

export async function updateHeroBannerAction(
    input: z.infer<typeof updateHeroBannerSchema>,
) {
    await requireAdmin();

    const validatedData = updateHeroBannerSchema.parse(input);

    if (
        validatedData.startAt &&
        validatedData.endAt &&
        validatedData.startAt >= validatedData.endAt
    ) {
        throw new Error("End date must be after start date");
    }

    const { id, ...data } = validatedData;

    if (data.isActive === true) {
        await ensureHeroBannerCanBeActive(id);
    }

    const banner = await updateHeroBanner(id, data);

    revalidatePath("/admin");
    revalidatePath("/admin/homepage");
    revalidatePath("/");

    return banner;
}

export async function deleteHeroBannerAction(
    input: z.infer<typeof deleteHeroBannerSchema>,
) {
    await requireAdmin();

    const validatedData = deleteHeroBannerSchema.parse(input);

    const banner = await getHeroBannerById(validatedData.id);

    if (!banner) {
        throw new Error("Hero banner not found");
    }

    /*
     * Delete desktop media from Cloudinary.
     */
    if (banner.desktopImagePublicId) {
        const result = await cloudinary.uploader.destroy(
            banner.desktopImagePublicId,
            {
                resource_type: "image",
            },
        );

        if (result.result !== "ok" && result.result !== "not found") {
            throw new Error(
                "Failed to delete desktop banner image",
            );
        }
    }

    /*
     * Delete mobile media from Cloudinary.
     */
    if (banner.mobileImagePublicId) {
        const result = await cloudinary.uploader.destroy(
            banner.mobileImagePublicId,
            {
                resource_type: "image",
            },
        );

        if (result.result !== "ok" && result.result !== "not found") {
            throw new Error(
                "Failed to delete mobile banner image",
            );
        }
    }

    /*
     * Delete banner record only after media cleanup succeeds.
     */
    const deletedBanner = await deleteHeroBanner(
        validatedData.id,
    );

    revalidatePath("/admin");
    revalidatePath("/admin/homepage");
    revalidatePath("/");

    return deletedBanner;
}

export async function toggleHeroBannerAction(
    input: z.infer<typeof toggleHeroBannerSchema>,
) {
    await requireAdmin();

    const validatedData = toggleHeroBannerSchema.parse(input);

    if (validatedData.isActive) {
        await ensureHeroBannerCanBeActive(validatedData.id);
    }

    const banner = await toggleHeroBanner(
        validatedData.id,
        validatedData.isActive,
    );

    revalidatePath("/admin");
    revalidatePath("/admin/homepage");
    revalidatePath("/");

    return banner;
}

export async function reorderHeroBannersAction(
    input: z.infer<typeof reorderHeroBannersSchema>,
) {
    await requireAdmin();

    const validatedData = reorderHeroBannersSchema.parse(input);

    const banners = await reorderHeroBanners(validatedData.ids);

    revalidatePath("/admin");
    revalidatePath("/admin/homepage");
    revalidatePath("/");

    return banners;
}