"use client";

import { useCart } from "@/app/context/CartContext";

export default function AddToCartButton({ product }: { product: any }) {
    const { addToCart } = useCart();

    const handleAdd = () => {
        addToCart(product);
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