"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

type Props = {
    className?: string;
};

export default function ConfirmPendingPayment({ className = "" }: Props) {
    const router = useRouter();
    const { clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function handleConfirm() {
        const cartId = localStorage.getItem("cart_id");

        if (!cartId) {
            setError("No hay un carrito activo para confirmar.");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await fetch("/api/orders/confirm-pending", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cart_id: cartId }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "No se pudo confirmar el pago");
                return;
            }

            localStorage.removeItem("pending_cart_id");
            await clearCart();
            setMessage("¡Compra confirmada! Redirigiendo...");
            router.push("/orders");
            router.refresh();
        } catch {
            setError("Error al confirmar el pago");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={`space-y-3 ${className}`}>
            <p className="text-sm text-gray-600">
                ¿Ya pagaste en Mercado Pago pero no volviste a la tienda?
                Confirmá tu compra acá.
            </p>

            <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className="bg-green-600 text-white px-5 py-2 rounded-lg disabled:opacity-50"
            >
                {loading ? "Verificando pago..." : "Ya pagué — confirmar compra"}
            </button>

            {message && (
                <p className="text-sm text-green-700">{message}</p>
            )}

            {error && (
                <p className="text-sm text-red-700" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
