import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const products = [
    {
        name: "Classic Wide-Leg Trouser",
        slug: "classic-wide-leg-trouser",
        description:
            "A refined wide-leg trouser with a clean silhouette, tailored for effortless everyday dressing.",
        price: 1499,
        compareAtPrice: 1999,
        sku: "LYR-TRS-001",
        category: "Trousers",
        images: [
            "/products/wide-leg-trouser-1.png",
            "/products/wide-leg-trouser-2.png",
            "/products/wide-leg-trouser-3.png",
            "/products/wide-leg-trouser-4.png",
        ],
        isFeatured: true,
        isNewArrival: true,
        variants: [
            { size: "XS", stock: 4 },
            { size: "S", stock: 8 },
            { size: "M", stock: 12 },
            { size: "L", stock: 6 },
            { size: "XL", stock: 2 },
        ],
    },

    {
        name: "Silk Relaxed Shirt",
        slug: "silk-relaxed-shirt",
        description:
            "A softly structured relaxed shirt designed with a fluid drape and understated elegance.",
        price: 1999,
        compareAtPrice: 2499,
        sku: "LYR-SHR-001",
        category: "Shirts",
        images: [
            "/products/silk-shirt-1.png",
            "/products/silk-shirt-2.png",
            "/products/silk-shirt-3.png",
            "/products/silk-shirt-4.png",
        ],
        isFeatured: true,
        isNewArrival: true,
        variants: [
            { size: "XS", stock: 5 },
            { size: "S", stock: 10 },
            { size: "M", stock: 14 },
            { size: "L", stock: 8 },
            { size: "XL", stock: 3 },
        ],
    },

    {
        name: "Minimal Ribbed Top",
        slug: "minimal-ribbed-top",
        description:
            "A refined ribbed top with a close, comfortable fit and timeless minimal styling.",
        price: 999,
        compareAtPrice: null,
        sku: "LYR-TOP-001",
        category: "Tops",
        images: [
            "/products/ribbed-top-1.png",
            "/products/ribbed-top-2.png",
            "/products/ribbed-top-3.png",
            "/products/ribbed-top-4.png",
        ],
        isFeatured: false,
        isNewArrival: true,
        variants: [
            { size: "XS", stock: 8 },
            { size: "S", stock: 15 },
            { size: "M", stock: 18 },
            { size: "L", stock: 10 },
            { size: "XL", stock: 5 },
        ],
    },

    {
        name: "Structured Everyday Blazer",
        slug: "structured-everyday-blazer",
        description:
            "A softly tailored blazer with a structured silhouette that transitions effortlessly from work to evening.",
        price: 2999,
        compareAtPrice: 3999,
        sku: "LYR-BLZ-001",
        category: "Blazers",
        images: [
            "/products/blazer-1.png",
            "/products/blazer-2.png",
            "/products/blazer-3.png",
            "/products/blazer-4.png",
        ],
        isFeatured: true,
        isNewArrival: false,
        variants: [
            { size: "XS", stock: 3 },
            { size: "S", stock: 7 },
            { size: "M", stock: 10 },
            { size: "L", stock: 6 },
            { size: "XL", stock: 2 },
        ],
    },

    {
        name: "Satin Midi Skirt",
        slug: "satin-midi-skirt",
        description:
            "A fluid satin midi skirt with an elegant fall, designed to bring subtle movement to everyday looks.",
        price: 1799,
        compareAtPrice: 2299,
        sku: "LYR-SKT-001",
        category: "Skirts",
        images: [
            "/products/satin-skirt-1.png",
            "/products/satin-skirt-2.png",
            "/products/satin-skirt-3.png",
            "/products/satin-skirt-4.png",
        ],
        isFeatured: true,
        isNewArrival: false,
        variants: [
            { size: "XS", stock: 4 },
            { size: "S", stock: 9 },
            { size: "M", stock: 13 },
            { size: "L", stock: 7 },
            { size: "XL", stock: 3 },
        ],
    },
];

async function main() {
    for (const product of products) {
        const { variants, ...productData } = product;

        const existingProduct = await prisma.product.findUnique({
            where: {
                slug: product.slug,
            },
        });

        await prisma.product.upsert({
            where: {
                sku: product.sku,
            },
            update: productData,
            create: {
                ...productData,
                variants: {
                    create: variants,
                },
            },
        });
    }

    console.log("LYRA products seeded successfully.");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });