import { WishlistContent } from "@/components/wishlist/wishlist-content";

export default function WishlistPage() {
    return (
        <main className="mx-auto max-w-7xl px-6 py-16">
            <div className="border-b border-lyra-border pb-6">
                <p className="text-xs uppercase tracking-[0.2em] text-lyra-muted">
                    Wishlist
                </p>

                <h1 className="font-display mt-3 text-4xl tracking-tight sm:text-5xl">
                    Piece You Love
                </h1>
            </div>

            <WishlistContent />
        </main>
    );
}