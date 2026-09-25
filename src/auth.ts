import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

const LoginSchema = z.object({
    email: z
        .string()
        .trim()
        .email(),

    password: z
        .string()
        .min(1),
});

export const {
    handlers,
    auth,
    signIn,
    signOut,
} = NextAuth({
    session: {
        strategy: "jwt",
    },

    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id as string;
                token.role = user.role;
            }

            return token;
        },

        session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id as string;
            }

            if (session.user && token.role) {
                session.user.role = token.role;
            }

            return session;
        }
    },

    providers: [
        Credentials({
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },

            async authorize(credentials) {
                const parsed =
                    LoginSchema.safeParse(credentials);

                if (!parsed.success) {
                    return null;
                }

                const email =
                    parsed.data.email.toLowerCase();

                const user =
                    await prisma.user.findUnique({
                        where: {
                            email,
                        },
                    });

                if (
                    !user ||
                    !user.passwordHash
                ) {
                    return null;
                }

                const isPasswordValid =
                    await bcrypt.compare(
                        parsed.data.password,
                        user.passwordHash
                    );

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role,
                };
            },
        }),
    ],
});