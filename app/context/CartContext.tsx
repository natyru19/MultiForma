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
    addToCart: (productId: string, variantId: string) => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
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

    const addToCart = async (productId: string, variantId: string) => {
        try {
        const storedCartId = localStorage.getItem("cart_id");

        const response = await fetch("/api/cart", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            product_id: productId,
            variant_id: variantId,
            cart_id: storedCartId,
            }),
        });

        const data = await response.json();

        const items = data.data.items;

        const formattedCart = items.map((item: any) => ({
            id: item.products.id,
            name: item.products.name,
            price: item.variants.price,
            image: item.products.image,
            quantity: item.quantity,
        }));

        setCart(formattedCart);

        const cartId = data.data.cart_id;
        localStorage.setItem("cart_id", cartId);

        console.log("Respuesta del backend:", data);
        } catch (error) {
        console.error("Error al agregar al carrito:", error);
        }
    };

    return (
        <CartContext.Provider value={{ cart, addToCart }}>
        {children}
        </CartContext.Provider>
    );
    }

    export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart debe usarse dentro de CartProvider");
    }
    return context;
}