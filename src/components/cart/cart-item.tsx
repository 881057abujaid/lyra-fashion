"use client";

import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";

import { useAppDispatch } from "@/store/hooks";
import {
    decreaseQuantity,
    increaseQuantity,
    removeFromCart,
    type CartItem as CartItemType
} from "@/store/slices/cart/cartSlice";

type CartItemProps = {
    item: CartItemType;
};

export function CartItem({ item }: CartItemProps) {
    const dispatch = useAppDispatch();

    const isAtMaxStock = item.quantity >= item.stock;

    function handleIncrease() {
        if (isAtMaxStock) return;

        dispatch(
            increaseQuantity({
                productId: item.productId,
                size: item.size,
            })
        );
    }

    function handleDecrease() {
        dispatch(
            decreaseQuantity({
                productId: item.productId,
                size: item.size,
            })
        );
    }

    function handleRemove() {
        dispatch(removeFromCart({
            productId: item.productId,
            size: item.size,
        }))
    }

    return (
        <article className="flex gap-5 border-b border-lyra-border py-6">
            {/* Product Image */}
            <div className="relative h-36 w-28 shrink-0 overflow-hidden bg-lyra-beige sm:h-44 sm:w-36">
                <Image
                    src={item.image}
                    alt={item.name}
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
                            {item.size}
                        </p>

                        <h2 className="mt-2 font-display text-xl tracking-tight">
                            {item.name}
                        </h2>

                        <p className="mt-2 text-sm">
                            ₹{item.price.toLocaleString("en-IN")}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleRemove}
                        aria-label={`Remove ${item.name} from bag`}
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
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="flex h-full w-10 items-center justify-center transition-colors hover:bg-lyra-beige"
                        >
                            <Minus size={14} strokeWidth={1.5} />
                        </button>

                        <span className="flex h-full w-10 items-center justify-center text-sm">
                            {item.quantity}
                        </span>

                        <button
                            type="button"
                            onClick={handleIncrease}
                            disabled={isAtMaxStock}
                            aria-label={`Increase quantity of ${item.name}`}
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