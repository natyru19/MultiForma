"use client";

import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const { cart, updateItemQuantity, removeItem } = useCart();
    const router = useRouter();

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
                        className="border p-4 rounded flex justify-between items-center"
                    >
                        <div>
                        <p className="font-semibold">{item.name}</p>

                        <div className="text-sm text-gray-500">
                            {item.option && <p>Opción: {item.option}</p>}
                            {item.color && <p>Color: {item.color}</p>}
                        </div>

                        <p className="mt-1 text-sm">
                            ${item.price} c/u
                        </p>
                        </div>

                        <div className="flex items-center gap-4">

                        <div className="flex items-center gap-2">
                            <button
                            onClick={() => {
                                if (item.quantity > 1) {
                                updateItemQuantity(item.cart_item_id, item.quantity - 1);
                                }
                            }}
                            disabled={item.quantity === 1}
                            className={`px-2 border rounded ${
                                item.quantity === 1 ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            >
                            -
                            </button>

                            <span>{item.quantity}</span>

                            <button
                            onClick={() =>
                                updateItemQuantity(item.cart_item_id, item.quantity + 1)
                            }
                            className="px-2 border rounded"
                            >
                            +
                            </button>
                        </div>

                        <p className="font-semibold w-20 text-right">
                            ${item.price * item.quantity}
                        </p>

                        <button
                            onClick={() => removeItem(item.cart_item_id)}
                            className="text-red-500 hover:text-red-700 text-lg"
                            title="Eliminar producto"
                        >
                            ❌
                        </button>

                        </div>
                    </div>
                ))}

                <div className="mt-6 text-right border-t pt-4">
                    <p className="text-lg">Total:</p>
                    <p className="text-2xl font-bold">${total}</p>
                </div>

                <button
                    onClick={() => router.push("/checkout")}
                    className="bg-[var(--primary)] text-white px-6 py-3 rounded-lg hover:bg-[var(--primary-light)] transition"
                >
                    Finalizar compra
                </button>
            </div>
        )}
        </div>
    );
}