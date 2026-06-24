"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";

type Props = {
    productId: string;
    variantId?: string;
    price?: number;
    quantity?: number;
    maxStock?: number;
};

export default function AddToCartButton({
    productId,
    variantId,
    price,
    quantity = 1,
    maxStock = 0,
}: Props) {
    const { addToCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleAdd = async () => {
        if (!variantId || !price) {
            alert("Seleccioná una variante");
            return;
        }

        if (maxStock <= 0) {
            alert("Este producto no tiene stock disponible");
            return;
        }

        if (quantity > maxStock) {
            alert(`Solo hay ${maxStock} unidades disponibles`);
            return;
        }

        setLoading(true);
        setSuccess(false);

        const added = await addToCart(
            productId,
            variantId,
            price,
            quantity
        );

        setLoading(false);

        if (added) {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
        }
    };

    return (
        <button
            onClick={handleAdd}
            disabled={loading || maxStock <= 0}
            className="w-full bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading
                ? "Agregando..."
                : success
                  ? "✓ Agregado al carrito"
                  : maxStock <= 0
                    ? "Sin stock"
                    : "Agregar al carrito"}
        </button>
    );
}
