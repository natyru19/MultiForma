"use client";

import { useCart } from "@/app/context/CartContext";

export default function CartPage() {
    const { cart } = useCart();

    return (
        <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Carrito</h1>

        {cart.length === 0 ? (
            <p>El carrito está vacío</p>
        ) : (
            <div className="space-y-4">
            {cart.map((item) => (
                <div
                key={`${item.id}-${item.variant_id}`}
                className="border p-4 rounded flex justify-between"
                >
                <div>
                    <p className="font-semibold">{item.name}</p>
                    <p>Cantidad: {item.quantity}</p>
                </div>

                <p>${item.price}</p>
                </div>
            ))}
            </div>
        )}
        </div>
    );
}