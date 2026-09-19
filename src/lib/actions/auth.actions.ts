"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";

import { prisma } from "../prisma";

const RegisterSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters."),
    email: z.string().trim().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters")
});

export async function registerUser(name: string, email: string, password: string) {
    const validatedData = RegisterSchema.parse({
        name, email, password,
    });
    const normalizedEmail = validatedData.email.toLocaleLowerCase();

    const existingUser = await prisma.user.findUnique({
        where: {
            email: normalizedEmail
        },
    });

    if (existingUser) {
        throw new Error("An account with this email already exists");
    }

    const passwordHash = await bcrypt.hash(validatedData.password, 12);

    const user = await prisma.user.create({
        data: {
            name: validatedData.name,
            email: normalizedEmail,
            passwordHash,
        },
        select: {
            id: true,
            name: true,
            email: true,
        }
    });

    return user;
}