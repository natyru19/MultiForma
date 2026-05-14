"use client";

import { useCart } from "@/app/context/CartContext";

export default function AddToCartButton({
    productId,
    variantId,
    price,
    }: {
    productId: string;
    variantId: string;
    price: number;
    }) {
    const { addToCart } = useCart();

    const handleAdd = () => {
        if (!variantId) {
        alert("Seleccioná una variante");
        return;
        }

        addToCart(productId, variantId, price);
    };

    return (
        <button
        onClick={handleAdd}
        className="w-full bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white py-3 rounded-lg transition"
        >
        Agregar al carrito
        </button>
    );
}