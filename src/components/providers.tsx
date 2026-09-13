"use client";

import { Provider } from "react-redux";
import { useRef } from "react";
import { makeStore, type AppStore } from "@/store/store";
import { StorePersistence } from "@/store/store-persistence";

type ProvidersProps = {
    children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
    const storeRef = useRef<AppStore | null>(null);

    if (!storeRef.current) {
        storeRef.current = makeStore();
    }

    return (
        <Provider store={storeRef.current}>
            <StorePersistence />
            {children}
        </Provider>
    );
}