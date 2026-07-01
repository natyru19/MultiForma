"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
    categoryId: string;
    active: boolean;
};

export default function CategoryActiveToggle({
    categoryId,
    active: initialActive,
}: Props) {
    const router = useRouter();
    const [active, setActive] = useState(initialActive);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleToggle() {
        const nextActive = !active;

        setError("");
        setLoading(true);

        try {
            const response = await fetch(`/api/admin/categories/${categoryId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ active: nextActive }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "No se pudo actualizar el estado");
                setLoading(false);
                return;
            }

            setActive(nextActive);
            router.refresh();
        } catch {
            setError("Error al actualizar el estado");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-end gap-1">
            <button
                type="button"
                role="switch"
                aria-checked={active}
                aria-label={active ? "Categoría activa" : "Categoría inactiva"}
                disabled={loading}
                onClick={handleToggle}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border transition-colors disabled:opacity-60 ${
                    active
                        ? "border-green-600 bg-green-600"
                        : "border-gray-300 bg-gray-200"
                }`}
            >
                <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        active ? "translate-x-6" : "translate-x-1"
                    }`}
                />
            </button>

            <span
                className={`text-xs font-medium ${
                    active ? "text-green-700" : "text-gray-500"
                }`}
            >
                {loading ? "Guardando..." : active ? "Activa" : "Inactiva"}
            </span>

            {error && (
                <p className="text-red-600 text-xs max-w-36 text-right" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
