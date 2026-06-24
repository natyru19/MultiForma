"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

type Props = {
    productId: string;
    variantId?: string;
    price?: number;
    quantity?: number;
    maxStock?: number;
};

export default function BuyNowButton({
    productId,
    variantId,
    price,
    quantity = 1,
    maxStock = 0,
}: Props) {
    const { addToCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleBuy = async () => {
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

        const success = await addToCart(
            productId,
            variantId,
            price,
            quantity
        );

        setLoading(false);

        if (success) {
            router.push("/checkout");
        }
    };

    return (
        <button
            onClick={handleBuy}
            disabled={loading || maxStock <= 0}
            className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading
                ? "Procesando..."
                : maxStock <= 0
                  ? "Sin stock"
                  : "Comprar ahora"}
        </button>
    );
}
