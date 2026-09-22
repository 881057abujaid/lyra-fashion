import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { ArrowRight } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function AccountPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <div className="border-b border-lyra-border pb-8">
                <p className="text-[10px] uppercase tracking-[0.2em] text-lyra-muted">
                    My Account
                </p>

                <h1 className="font-display mt-3 text-4xl tracking-tight sm:text-5xl">
                    Welcome back {session.user.name ? `, ${session.user.name}` : ""}
                </h1>

                <p className="mt-4 text-sm text-lyra-muted">
                    {session.user.email}
                </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
                <div className="border border-lyra-border bg-lyra-white p-8">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-lyra-muted">
                        Orders
                    </p>
                    <h2 className="font-display mt-4 text-2xl">
                        Your Orders
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-lyra-muted">
                        View your order history and track your purchases.
                    </p>

                    <div className="mt-8">
                        <Link
                            href="/account/orders"
                            className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-lyra-black hover:text-lyra-primary transition-colors"
                        >
                            <span>View Orders</span>
                            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>

                <div className="border border-lyra-border bg-lyra-white p-8">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-lyra-muted">
                        Wishlist
                    </p>

                    <h2 className="font-display mt-4 text-2xl">
                        Saved Pieces
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-lyra-muted">
                        Keep the pieces you love close at hand.
                    </p>
                </div>

                <div className="border border-lyra-border bg-lyra-white p-8">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-lyra-muted">
                        Profile
                    </p>

                    <h2 className="font-display mt-4 text-2xl">
                        Personal Details
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-lyra-muted">
                        Manage your account information and preferences.
                    </p>
                </div>
            </div>

            <div className="mt-16 border-t border-lyra-border pt-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-lyra-muted">
                            Account Actions
                        </p>

                        <p className="mt-2 text-sm text-lyra-muted">
                            Sign out of your LYRA account on this device.
                        </p>
                    </div>
                    <div className="w-full sm:w-56">
                        <SignOutButton />
                    </div>
                </div>
            </div>
        </main>
    );
}