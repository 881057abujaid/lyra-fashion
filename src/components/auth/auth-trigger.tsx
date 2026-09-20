"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";
import { useSession } from "next-auth/react";

export function AccountTrigger() {
    const { status } = useSession();

    const href = status === "authenticated" ? "/account" : "/login";

    return (
        <Link
            href={href}
            aria-label={status === "authenticated" ? "Account" : "Sign in"}
            className="transition-opacity hover:opacity-60"
        >
            <UserRound
                className="h-4 w-4"
                strokeWidth={1.5}
            />
        </Link>
    );
}