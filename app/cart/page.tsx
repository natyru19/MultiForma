"use client";

import { useCart } from "@/app/context/CartContext";

export default function CartPage() {
    const { cart } = useCart();

    const total = cart.reduce(
        (acc, item) => acc + item.price * item.quantity, 0
    );

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
                className="border p-4 rounded"
                >
                
                    <p className="font-semibold">{item.name}</p>
                    
                    <div className="text-sm text-gray-500">
                        {item.option && <p>Opción: {item.option}</p>}
                        {item.color && <p>Color: {item.color}</p>}
                    </div>

                    <div className="flex justify-between mt-2">
                        <p>
                            ${item.price} x {item.quantity}
                        </p>

                        <p className="font-semibold">
                            ${item.price * item.quantity}
                        </p>
                    </div>
                </div>
            ))}

                <div className="mt-6 text-right border-t pt-4">
                    <p className="text-lg">Total:</p>
                    <p className="text-2xl font-bold">${total}</p>
                </div>
            </div>
        )}
        </div>
    );
}