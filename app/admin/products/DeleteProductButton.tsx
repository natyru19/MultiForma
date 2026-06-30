"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
    productId: string;
    productName: string;
};

export default function DeleteProductButton({ productId, productName }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleDelete() {
        const confirmed = window.confirm(
            `¿Eliminar "${productName}"? Esta acción no se puede deshacer.`
        );

        if (!confirmed) return;

        setError("");
        setLoading(true);

        try {
            const response = await fetch(`/api/admin/products/${productId}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "No se pudo eliminar el producto");
                setLoading(false);
                return;
            }

            router.refresh();
        } catch {
            setError("Error al eliminar el producto");
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-end gap-1">
            <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="border border-red-600 text-red-600 px-4 py-2 rounded shrink-0 hover:bg-red-50 disabled:opacity-60"
            >
                {loading ? "Eliminando..." : "Eliminar"}
            </button>

            {error && (
                <p className="text-red-600 text-xs max-w-48 text-right" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
