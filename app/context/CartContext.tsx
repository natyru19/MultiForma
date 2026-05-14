"use client";

import { createContext, useContext, useEffect, useState } from "react";

type CartItem = {
    id: string;
    cart_item_id: string;
    product_id: string;
    variant_id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    option?: string;
    color?: string;
};

type CartContextType = {
    cart: CartItem[];
    addToCart: (productId: string, variantId: string, price: number) => Promise<void>;
    updateItemQuantity: (cart_item_id: string, quantity: number) => Promise<void>;
    removeItem: (cart_item_id: string) => Promise<void>;
    clearCart: () => Promise<void>;
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

    const addToCart = async (productId: string, variantId: string, price: number) => {
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
            price,
            cart_id: storedCartId,
            }),
        });

        const data = await response.json();

        const items = data.data.items;

        console.log("DATA CART:", data);

        console.log("ITEMS:", items);

        const formattedCart = items.map((item: any) => ({
            id: item.products?.id,
            cart_item_id: item.id,
            product_id: item.product_id,
            variant_id: item.variant_id,
            name: item.products?.name,
            price: item.variants?.price,
            image: item.products?.image,
            quantity: item.quantity,
            option: item.variants?.option,
            color: item.variants?.color,
        }));

        setCart(formattedCart);

        const cartId = data.data.cart_id;
        localStorage.setItem("cart_id", cartId);

        console.log("Respuesta del backend:", data);
        } catch (error) {
        console.error("Error al agregar al carrito:", error);
        }
    };

    const updateItemQuantity = async (cart_item_id: string, quantity: number) => {
        try {
            await fetch("/api/cart", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cart_item_id, quantity }),
            });

            setCart((prev) =>
                prev
                    .map((item) =>
                        item.cart_item_id === cart_item_id
                            ? { ...item, quantity }
                            : item
                    )
                    .filter((item) => item.quantity > 0)
            );

        } catch (error) {
            console.error(error);
        }
    };

    const removeItem = async (cart_item_id: string) => {
        try {
            await fetch("/api/cart", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cart_item_id }),
            });

            setCart((prev) =>
                prev.filter((item) => item.cart_item_id !== cart_item_id)
            );

        } catch (error) {
            console.error(error);
        }
    };

    const clearCart = async () => {
        try {
            const cartId = localStorage.getItem("cart_id");

            if (!cartId) return;

            await fetch("/api/cart/clear", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ cart_id: cartId }),
            });

            await fetch(`/api/cart/${cartId}`, {
                method: "DELETE",
            });

            localStorage.removeItem("cart_id");
            localStorage.removeItem("cart");
            setCart([]);

        } catch (error) {
            console.error("Error limpiando carrito:", error);
        }
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, updateItemQuantity, removeItem, clearCart }}>
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