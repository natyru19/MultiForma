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
    isReady: boolean;
    addToCart: (
        productId: string,
        variantId: string,
        price: number,
        quantity?: number
    ) => Promise<boolean>;
    updateItemQuantity: (cart_item_id: string, quantity: number) => Promise<boolean>;
    removeItem: (cart_item_id: string) => Promise<void>;
    clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

function formatCartItems(items: unknown[]): CartItem[] {
    if (!items?.length) return [];

    return items.map((raw) => {
        const item = raw as {
            id: string;
            product_id: string;
            variant_id: string;
            quantity: number;
            price?: number;
            products?: { id?: string; name?: string; image?: string | null };
            variants?: {
                price?: number | string;
                option?: string | null;
                color?: string | null;
            };
        };

        return {
            id: item.products?.id ?? item.product_id,
            cart_item_id: item.id,
            product_id: item.product_id,
            variant_id: item.variant_id,
            name: item.products?.name ?? "Producto",
            price: Number(item.variants?.price ?? item.price ?? 0),
            image: item.products?.image ?? "",
            quantity: item.quantity,
            option: item.variants?.option ?? undefined,
            color: item.variants?.color ?? undefined,
        };
    });
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        async function hydrateCart() {
            try {
                const storedCartId = localStorage.getItem("cart_id");

                if (storedCartId) {
                    const response = await fetch(
                        `/api/cart?cart_id=${encodeURIComponent(storedCartId)}`
                    );

                    if (response.ok) {
                        const data = await response.json();
                        const items = data.data?.items ?? [];

                        if (items.length > 0) {
                            setCart(formatCartItems(items));
                            return;
                        }

                        localStorage.removeItem("cart_id");
                    }
                }

                const storedCart = localStorage.getItem("cart");

                if (storedCart) {
                    const parsed = JSON.parse(storedCart) as CartItem[];

                    if (Array.isArray(parsed) && parsed.length > 0) {
                        setCart(parsed);
                    }
                }
            } catch (error) {
                console.error("Error al cargar el carrito:", error);
            } finally {
                setIsReady(true);
            }
        }

        hydrateCart();
    }, []);

    useEffect(() => {
        if (!isReady) return;

        if (cart.length > 0) {
            localStorage.setItem("cart", JSON.stringify(cart));
        } else {
            localStorage.removeItem("cart");
        }
    }, [cart, isReady]);

    const addToCart = async (
        productId: string,
        variantId: string,
        price: number,
        quantity = 1
    ): Promise<boolean> => {
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
                    quantity,
                    cart_id: storedCartId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || "No se pudo agregar al carrito");
                return false;
            }

            const items = data.data?.items ?? [];
            const formattedCart = formatCartItems(items);

            setCart(formattedCart);
            localStorage.setItem("cart_id", data.data.cart_id);

            return formattedCart.length > 0;
        } catch (error) {
            console.error("Error al agregar al carrito:", error);
            alert("Error al agregar al carrito");
            return false;
        }
    };

    const updateItemQuantity = async (
        cart_item_id: string,
        quantity: number
    ): Promise<boolean> => {
        try {
            const response = await fetch("/api/cart", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cart_item_id, quantity }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || "No se pudo actualizar la cantidad");
                return false;
            }

            setCart((prev) =>
                prev
                    .map((item) =>
                        item.cart_item_id === cart_item_id
                            ? { ...item, quantity }
                            : item
                    )
                    .filter((item) => item.quantity > 0)
            );

            return true;
        } catch (error) {
            console.error(error);
            return false;
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

            if (cartId) {
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
            }

            localStorage.removeItem("cart_id");
            localStorage.removeItem("cart");
            setCart([]);
        } catch (error) {
            console.error("Error limpiando carrito:", error);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                isReady,
                addToCart,
                updateItemQuantity,
                removeItem,
                clearCart,
            }}
        >
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
