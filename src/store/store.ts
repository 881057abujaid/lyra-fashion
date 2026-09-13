import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cart/cartSlice";
import wishlistReducer from "./slices/wishlist/wishlistSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            cart: cartReducer,
            wishlist: wishlistReducer,
        },
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];