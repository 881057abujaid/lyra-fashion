"use server";

import { z } from "zod";
import { auth, unstable_update } from "@/auth";
import { prisma } from "../prisma";

const UpdateAccountSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters."),
});

export async function updateAccountName(name: string) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("You must be logged in.");
    }

    const validatedData = UpdateAccountSchema.parse({
        name,
    });

    const user = await prisma.user.update({
        where: {
            id: session.user.id,
        },
        data: {
            name: validatedData.name,
        },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });

    await unstable_update({
        user: {
            name: user.name,
        },
    });

    return user;
}