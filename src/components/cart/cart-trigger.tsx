"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { CartDrawer } from "./cart-drawer";

export function CartTrigger() {
    const [isOpen, setIsOpen] = useState(false);

    const totalItems = useAppSelector((state) =>
        state.cart.items.reduce(
            (total, item) => total + item.quantity,
            0
        )
    );

    return (
        <>
            <button
                type="button"
                aria-label={`Shopping bag with ${totalItems} items`}
                onClick={() => setIsOpen(true)}
                className="relative transition-opacity hover:opacity-60"
            >
                <ShoppingBag size={19} strokeWidth={1.5} />
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-lyra-black px-1 text-[9px] text-lyra-white">
                    {totalItems}
                </span>
            </button>

            <CartDrawer
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}