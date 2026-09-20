"use client";

import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import { useAppDispatch } from "@/store/hooks";
import { hydrateCart } from "@/store/slices/cart/cartSlice";
import { mapCartToViewItem } from "@/lib/utils/cart";
import { updateCartItemAction, removeCartItemAction } from "@/lib/actions/cart.actions";

type CartItemProps = {
    variantId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    size: string;
    stock: number;
};

export function CartItem({ variantId, name, price, image, quantity, size, stock }: CartItemProps) {
    const dispatch = useAppDispatch();
    const isAtMaxStock = quantity >= stock;

    async function handleIncrease() {
        if (isAtMaxStock) return;

        try {
            const cart = await updateCartItemAction(variantId, quantity + 1);

            if (!cart) {
                throw new Error("Cart not found after update");
            }

            dispatch(hydrateCart(mapCartToViewItem(cart)));
        } catch (error) {
            console.log("Error updating cart item", error);
        }
    }

    async function handleDecrease() {
        try {
            if (quantity <= 1) {
                await handleRemove();
            } else {
                const cart = await updateCartItemAction(variantId, quantity - 1);

                if (!cart) {
                    throw new Error("Cart not found after update");
                }

                dispatch(hydrateCart(mapCartToViewItem(cart)));
            }
        } catch (error) {
            console.log("Error updating cart item", error);
        }
    }

    async function handleRemove() {
        try {
            const cart = await removeCartItemAction(variantId);

            if (!cart) {
                throw new Error("Cart not found after removal");
            }

            dispatch(hydrateCart(mapCartToViewItem(cart)));
        } catch (error) {
            console.log("Error removing cart item", error);
        }
    }

    return (
        <article className="flex gap-5 border-b border-lyra-border py-6">
            {/* Product Image */}
            <div className="relative h-36 w-28 shrink-0 overflow-hidden bg-lyra-beige sm:h-44 sm:w-36">
                <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="144px"
                    className="object-cover"
                />
            </div>

            {/* Product Details */}
            <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-lyra-muted">
                            {size}
                        </p>

                        <h2 className="mt-2 font-display text-xl tracking-tight">
                            {name}
                        </h2>

                        <p className="mt-2 text-sm">
                            ₹{price.toLocaleString("en-IN")}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleRemove}
                        aria-label={`Remove ${name} from bag`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center text-lyra-muted transition-colors hover:text-lyra-black"
                    >
                        <X size={17} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Quantity */}
                <div className="mx-auto pt-6">
                    <div className="inline-flex h-10 items-center border border-lyra-border">
                        <button
                            type="button"
                            onClick={handleDecrease}
                            aria-label={`Decrease quantity of ${name}`}
                            className="flex h-full w-10 items-center justify-center transition-colors hover:bg-lyra-beige"
                        >
                            <Minus size={14} strokeWidth={1.5} />
                        </button>

                        <span className="flex h-full w-10 items-center justify-center text-sm">
                            {quantity}
                        </span>

                        <button
                            type="button"
                            onClick={handleIncrease}
                            disabled={isAtMaxStock}
                            aria-label={`Increase quantity of ${name}`}
                            className="flex h-full w-10 items-center justify-center transition-colors hover:bg-lyra-beige disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            <Plus size={14} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}