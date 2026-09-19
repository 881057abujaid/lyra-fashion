import { redirect } from "next/navigation";
import { auth } from "@/auth";

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
        </main>
    );
}