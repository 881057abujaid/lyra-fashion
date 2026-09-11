import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    size: string;
    stock: number;
};

type CartState = {
    items: CartItem[];
};

const initialState: CartState = {
    items: [],
};

const cartSlice = createSlice({
    name: "Cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find((item) => item.productId === action.payload.productId
                && item.size === action.payload.size);

            if (existingItem) {
                existingItem.quantity = Math.min(
                    existingItem.quantity + action.payload.quantity,
                    action.payload.stock
                );

                existingItem.stock = action.payload.stock;
            } else {
                state.items.push({
                    ...action.payload,
                    quantity: Math.min(
                        action.payload.quantity,
                        action.payload.stock
                    )
                });
            }
        },

        increaseQuantity: (state, action: PayloadAction<{
            productId: string;
            size: string;
        }>) => {
            const item = state.items.find((item) => item.productId === action.payload.productId
                && item.size === action.payload.size);

            if (item && item.quantity < item.stock) {
                item.quantity += 1;
            }
        },

        decreaseQuantity: (state, action: PayloadAction<{
            productId: string;
            size: string;
        }>) => {
            const item = state.items.find((item) => item.productId === action.payload.productId
                && item.size === action.payload.size);

            if (!item) return;

            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                state.items = state.items.filter((cartItem) => !(cartItem.productId === action.payload.productId
                    && cartItem.size === action.payload.size
                ));
            }
        },

        removeFromCart: (state, action: PayloadAction<{
            productId: string;
            size: string;
        }>) => {
            state.items = state.items.filter((item) => !(item.productId === action.payload.productId
                && item.size === action.payload.size
            ));
        },

        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const { addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
