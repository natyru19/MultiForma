"use client";

import Link from "next/link";

export default function SuccessPage() {
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