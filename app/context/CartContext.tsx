"use client";

import { createContext, useContext, useEffect, useState } from "react";

type CartItem = {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
};

type CartContextType = {
    cart: CartItem[];
    addToCart: (product: CartItem) => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: any) {
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
        setCart(JSON.parse(storedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: CartItem) => {
        setCart((prev) => {
        const existing = prev.find((item) => item.id === product.id);

        if (existing) {
            return prev.map((item) =>
            item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
        }

        return [...prev, { ...product, quantity: 1 }];
        });
    };

    return (
        <CartContext.Provider value={{ cart, addToCart }}>
        {children}
        </CartContext.Provider>
    );
    }

    export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
    return context;
}