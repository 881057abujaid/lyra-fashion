import { prisma } from "../prisma";

export async function getActiveHeroBanners() {
    const now = new Date();

    return prisma.heroBanner.findMany({
        where: {
            isActive: true,
            desktopImageUrl: {
                not: null,
            },
            AND: [
                {
                    OR: [
                        { startAt: null },
                        { startAt: { lte: now } },
                    ],
                },
                {
                    OR: [
                        { endAt: null },
                        { endAt: { gte: now } },
                    ],
                },
            ],
        },
        orderBy: {
            sortOrder: "asc",
        },
    });
}

export async function getAllHeroBanners() {
    return prisma.heroBanner.findMany({
        orderBy: [
            {
                sortOrder: "asc",
            },
            {
                createdAt: "desc",
            },
        ],
    });
}

export async function getHeroBannerById(id: string) {
    return prisma.heroBanner.findUnique({
        where: {
            id,
        },
    });
}

export async function createHeroBanner(
    data: {
        title?: string;
        subtitle?: string;
        desktopImageUrl?: string;
        desktopImagePublicId?: string;
        mobileImageUrl?: string;
        mobileImagePublicId?: string;
        imageAlt: string;
        ctaLabel?: string;
        ctaHref?: string;
        sortOrder: number;
        isActive: boolean;
        startAt?: Date;
        endAt?: Date;
    }
) {
    return prisma.heroBanner.create({
        data: {
            title: data.title,
            subtitle: data.subtitle,
            desktopImageUrl: data.desktopImageUrl,
            desktopImagePublicId: data.desktopImagePublicId,
            mobileImageUrl: data.mobileImageUrl,
            mobileImagePublicId: data.mobileImagePublicId,
            imageAlt: data.imageAlt,
            ctaLabel: data.ctaLabel,
            ctaHref: data.ctaHref,
            sortOrder: data.sortOrder ?? 0,
            isActive: data.isActive ?? true,
            startAt: data.startAt,
            endAt: data.endAt,
        },
    });
}

export async function updateHeroBanner(
    id: string,
    data: {
        title?: string;
        subtitle?: string;
        imageAlt?: string;
        ctaLabel?: string;
        ctaHref?: string;
        startAt?: Date | null;
        endAt?: Date | null;
        isActive?: boolean;
    }
) {
    return prisma.heroBanner.update({
        where: {
            id,
        },
        data,
    });
}

export async function deleteHeroBanner(id: string) {
    return prisma.heroBanner.delete({
        where: {
            id,
        },
    });
}

export async function toggleHeroBanner(id: string, isActive: boolean) {
    return prisma.heroBanner.update({
        where: {
            id,
        },
        data: {
            isActive,
        },
    });
}

export async function reorderHeroBanners(ids: string[]) {
    return prisma.$transaction(ids.map((id, index) =>
        prisma.heroBanner.update({
            where: {
                id,
            },
            data: {
                sortOrder: index,
            },
        }),
    ));
}