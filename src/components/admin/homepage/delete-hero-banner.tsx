"use client";

import { useEffect, useState, useTransition } from "react";
import { Trash2, X } from "lucide-react";

import { deleteHeroBannerAction } from "@/lib/actions/admin-hero.actions";

type DeleteHeroBannerButtonProps = {
    heroBannerId: string;
    bannerTitle: string;
};

export function DeleteHeroBannerButton({
    heroBannerId,
    bannerTitle,
}: DeleteHeroBannerButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape" && !isPending) {
                setIsOpen(false);
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, isPending]);

    function handleDelete() {
        setError(null);

        startTransition(async () => {
            try {
                await deleteHeroBannerAction({
                    id: heroBannerId,
                });

                window.location.reload();
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to delete hero banner",
                );
            }
        });
    }

    return (
        <>
            {/* Delete Trigger */}
            <button
                type="button"
                onClick={() => {
                    setError(null);
                    setIsOpen(true);
                }}
                className="inline-flex items-center gap-2 border border-lyra-border px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-lyra-muted transition-colors hover:border-red-300 hover:text-red-600"
            >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
            </button>

            {/* Confirmation Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-5 backdrop-blur-[2px]"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !isPending
                        ) {
                            setIsOpen(false);
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-hero-title"
                        className="relative w-full max-w-md border border-lyra-border bg-lyra-white shadow-xl"
                    >
                        {/* Close */}
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            disabled={isPending}
                            aria-label="Close"
                            className="absolute right-5 top-5 text-lyra-muted transition-colors hover:text-lyra-black disabled:opacity-50"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="px-6 py-7">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-lyra-subtle">
                                Destructive Action
                            </p>

                            <h2
                                id="delete-hero-title"
                                className="mt-2 font-display text-2xl tracking-tight text-lyra-black"
                            >
                                Delete Hero Banner?
                            </h2>

                            <div className="mt-5 border border-lyra-border bg-lyra-soft px-4 py-3">
                                <p className="text-sm font-medium text-lyra-black">
                                    {bannerTitle}
                                </p>
                            </div>

                            <p className="mt-4 text-sm leading-6 text-lyra-muted">
                                This action will permanently delete this
                                hero banner and its associated images.
                            </p>

                            {error && (
                                <div className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700">
                                    {error}
                                </div>
                            )}

                            <div className="mt-7 flex justify-end gap-3 border-t border-lyra-border pt-5">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    disabled={isPending}
                                    className="border border-lyra-border px-5 py-2.5 text-[10px] uppercase tracking-[0.14em] text-lyra-muted transition-colors hover:border-lyra-black hover:text-lyra-black disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={isPending}
                                    className="inline-flex items-center gap-2 border border-red-300 bg-red-600 px-5 py-2.5 text-[10px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />

                                    {isPending
                                        ? "Deleting..."
                                        : "Delete Banner"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}