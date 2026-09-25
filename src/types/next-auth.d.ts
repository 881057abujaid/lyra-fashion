import "next-auth";
import "next-auth/jwt";

import type { DefaultSession } from "next-auth";

export type UserRole = "CUSTOMER" | "ADMIN";

declare module "next-auth" {
    interface User {
        role?: UserRole;
    }

    interface Session {
        user: {
            id: string;
            role: UserRole;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        role?: UserRole;
    }
}