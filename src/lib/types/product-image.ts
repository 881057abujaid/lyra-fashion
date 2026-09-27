export type ProductImage = {
    id: string;
    productId: string;
    url: string;
    publicId: string;
    alt: string | null;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
};