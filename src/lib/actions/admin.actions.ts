"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "../auth/authorization";
import { updateAdminOrderStatus } from "../data/admin";

const updateOrderStatusSchema = z.object({
    orderId: z.string().min(1, "Order ID is required"),
    status: z.enum([
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
    ]),
});

export async function updateAdminOrderStatusAction(
    orderId: string,
    status: string,
) {
    await requireAdmin();

    const validatedData = updateOrderStatusSchema.parse({
        orderId,
        status,
    });

    const order = await updateAdminOrderStatus(
        validatedData.orderId,
        validatedData.status,
    );

    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${validatedData.orderId}`);

    return order;
}