import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { auth } from "@/auth";
import { PersonalDetailsForm } from "@/components/account/personal-details-form";

export default async function PersonalDetailsPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <div className="border-b border-lyra-border pb-8">
                <Link
                    href="/account"
                    className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-lyra-muted transition-colors hover:text-lyra-black"
                >
                    <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
                    <span>Back to Account</span>
                </Link>

                <p className="mt-8 text-[10px] uppercase tracking-[0.2em] text-lyra-muted">
                    Profile
                </p>

                <h1 className="font-display mt-3 text-4xl tracking-tight sm:text-5xl">
                    Personal Details
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-6 text-lyra-muted">
                    Manage the personal information associated with your LYRA account.
                </p>
            </div>

            <div className="mt-12 max-w-4xl">
                <PersonalDetailsForm
                    name={session.user.name ?? ""}
                    email={session.user.email ?? ""}
                />
            </div>
        </main>
    );
}