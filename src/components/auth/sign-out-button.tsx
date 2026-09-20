"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
    const [isPending, setIsPending] = useState(false);

    async function handleSignOut() {
        if (isPending) return;

        setIsPending(true);

        try {
            await signOut({
                redirectTo: "/login",
            });
        } catch (error) {
            console.error("Sign out failed:", error);
            setIsPending(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleSignOut}
            disabled={isPending}
            className="group flex w-full items-center justify-between border border-lyra-border bg-lyra-white px-6 py-5 text-left transition-all duration-300 hover:border-lyra-black hover:bg-lyra-white disabled:cursor-not-allowed disabled:opacity-50"
        >
            <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-lyra-muted">
                    Account
                </p>
                <p className="mt-1 text-sm">
                    {isPending ? "Signing out..." : "Sign out"}
                </p>
            </div>
            <LogOut
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.5}
            />
        </button>
    );
}