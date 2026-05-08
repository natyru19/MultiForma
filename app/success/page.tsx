"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

export default function SuccessPage() {

    const { cart, clearCart } = useCart();

    const [saved, setSaved] = useState(false);

    useEffect(() => {

        const saveOrder = async () => {

            try {

                console.log("CART:", cart);

                const response = await fetch("/api/orders", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        cart,
                        form: {
                            name: "",
                            email: "",
                            phone: "",
                            address: "",
                        },
                    }),
                });

                const data = await response.json();

                console.log("ORDER RESPONSE:", data);

                await clearCart();

                setSaved(true);

            } catch (error) {
                console.error(error);
            }
        };

        if (cart.length > 0 && !saved) {
            saveOrder();
        }

    }, [cart, saved]);

    return (
        <div className="p-6 max-w-2xl mx-auto text-center">

            <h1 className="text-3xl font-bold mb-4">
                🎉 ¡Compra realizada!
            </h1>

            <p className="text-gray-600 mb-6">
                Tu pedido fue procesado correctamente.
            </p>

            <Link
                href="/products"
                className="bg-[var(--primary)] text-white px-6 py-3 rounded-lg"
            >
                Seguir comprando
            </Link>

        </div>
    );
}