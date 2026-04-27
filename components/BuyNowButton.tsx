"use client";

export default function BuyNowButton({ product }: any) {
    const handleBuy = () => {
        console.log("Comprar:", product);
    };

    return (
        <button
            onClick={handleBuy}
            className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white py-3 rounded-lg mt-2 transition"
        >
            Comprar ahora
        </button>
    );
}