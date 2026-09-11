"use client";

import { useState } from "react";
import { addToCart } from "@/store/slices/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

type ProductVariant = {
    id: string;
    size: string;
    stock: number;
};

type ProductPurchaseProps = {
    productId: string;
    name: string;
    price: number;
    image: string;
    variants: ProductVariant[];
};

export function ProductPurchase({ productId, name, price, image, variants }: ProductPurchaseProps) {
    const dispatch = useAppDispatch();
    const cartItem = useAppSelector((state) => state.cart.items);

    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);

    const selectedVariant = variants.find((variant) => variant.size === selectedSize);

    const cartQuantity = cartItem.find((item) => item.productId === productId &&
        item.size === selectedSize)?.quantity ?? 0;

    const maxQuantity = selectedVariant?.stock ?? 0;
    const remainingStock = Math.max(0, (selectedVariant?.stock ?? 0) - cartQuantity);

    function handleQuantityDecrease() {
        setQuantity((current) => Math.max(1, current - 1));
    }

    function handleQuantityIncrease() {
        if (!selectedVariant) return;

        setQuantity((current) => Math.min(remainingStock, current + 1));
    }

    function handleAddToCart() {
        if (!selectedVariant) return;

        if (remainingStock <= 0) return;

        dispatch(addToCart({
            productId,
            name,
            price,
            image,
            quantity: Math.min(quantity, remainingStock),
            size: selectedVariant.size,
            stock: remainingStock,
        }));

        setIsAdded(true);
    }

    return (
        <div>
            {/* Size */}
            <div className="border-t border-lyra-border pt-8">
                <div className="flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-lyra-muted">
                        Select Size
                    </p>

                    {selectedVariant && (
                        <p className="text-xs text-lyra-muted">
                            {selectedVariant.stock} available
                        </p>
                    )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {variants.map((variant) => {
                        const isSelected =
                            selectedSize === variant.size;

                        const isOutOfStock =
                            variant.stock === 0;

                        return (
                            <button
                                key={variant.id}
                                type="button"
                                disabled={isOutOfStock}
                                onClick={() => {
                                    setSelectedSize(variant.size);
                                    setQuantity(1);
                                    setIsAdded(false);
                                }}
                                className={`border px-6 py-3 text-xs transition-colors ${isSelected
                                    ? "border-lyra-black bg-lyra-black text-lyra-white"
                                    : "border-lyra-border hover:border-lyra-black"
                                    } ${isOutOfStock
                                        ? "cursor-not-allowed opacity-40"
                                        : ""
                                    }`}
                            >
                                {variant.size}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Quantity */}
            <div className="mt-8 border-t border-lyra-border pt-8">
                <p className="text-[10px] uppercase tracking-[0.18em] text-lyra-muted">
                    Quantity
                </p>

                <div className="mt-4 inline-flex items-center border border-lyra-border">
                    <button
                        type="button"
                        onClick={handleQuantityDecrease}
                        disabled={!selectedVariant}
                        className="px-4 py-3 text-sm transition-opacity hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>

                    <span className="min-w-10 text-center text-sm">
                        {quantity}
                    </span>

                    <button
                        type="button"
                        onClick={handleQuantityIncrease}
                        disabled={
                            !selectedVariant ||
                            quantity >= maxQuantity
                        }
                        className="px-4 py-3 text-sm transition-opacity hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Add to Bag */}
            <div className="mt-8">
                <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!selectedVariant || remainingStock <= 0}
                    className="w-full bg-lyra-black px-6 py-4 text-xs uppercase tracking-[0.18em] text-lyra-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {!selectedVariant
                        ? "Select a Size"
                        : remainingStock <= 0
                            ? "Maximum in Bag"
                            : isAdded
                                ? "Added to Bag"
                                : "Add to Bag"}
                </button>
            </div>
        </div>
    );
}