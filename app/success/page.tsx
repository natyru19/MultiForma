"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import BackLink from "@/components/BackLink";
import { useCart } from "@/app/context/CartContext";

function SuccessContent() {
    const searchParams = useSearchParams();
    const { clearCart } = useCart();

    const [status, setStatus] = useState<"loading" | "success" | "error">(
        "loading"
    );
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function confirmPurchase() {
            const paymentId =
                searchParams.get("payment_id") ||
                searchParams.get("collection_id");

            if (!paymentId || paymentId === "null") {
                setStatus("success");
                return;
            }

            try {
                const response = await fetch("/api/orders/confirm", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        payment_id: paymentId,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    setErrorMessage(
                        data.error || "No se pudo confirmar la compra"
                    );
                    setStatus("error");
                    return;
                }

                await clearCart();
                setStatus("success");
            } catch {
                setErrorMessage("Error al confirmar la compra");
                setStatus("error");
            }
        }

        confirmPurchase();
    }, [searchParams, clearCart]);

    if (status === "loading") {
        return (
            <div className="p-6 max-w-2xl mx-auto text-center">
                <p className="text-lg">Confirmando tu compra...</p>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="p-6 max-w-2xl mx-auto text-center">
                <BackLink href="/cart" label="Volver al carrito" className="mb-6" />

                <h1 className="text-3xl font-bold mb-4">
                    Hubo un problema
                </h1>

                <p className="text-red-700 mb-6">{errorMessage}</p>

                <p className="text-gray-600 mb-6">
                    Si el pago fue descontado, contactanos con tu comprobante.
                </p>

                <Link
                    href="/orders"
                    className="border px-6 py-3 rounded-lg inline-block"
                >
                    Ver mis compras
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto text-center">
            <BackLink href="/orders" label="Mis compras" className="mb-6" />

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

export default function SuccessPage() {
    return (
        <Suspense
            fallback={
                <p className="p-6 text-center">Confirmando tu compra...</p>
            }
        >
            <SuccessContent />
        </Suspense>
    );
}

