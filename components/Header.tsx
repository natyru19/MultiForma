"use client";

import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

export default function Header() {
    const { cart } = useCart();

    const totalItems = cart.reduce(
    (acc, item) => acc + item.quantity, 0);

    return (
        <header className="flex justify-between items-center p-8 border-b bg-[var(--primary-dark)] text-white shadow-md">

            <div className="flex-1 font-bold">
                <Link href="/" className="flex items-center gap-2">
                    <img 
                        src="https://rnyawemxuljswnfoepnj.supabase.co/storage/v1/object/public/product-images/logoMF.jpeg" 
                        alt="MF"
                        className="w-28 h-28 object-cover rounded-xl border-black"
                />
                </Link>
            </div>

            <nav className="flex-1 flex justify-center gap-4 hover:text-gray-200">
                <Link href="/" className="hover:underline">Inicio</Link>
                <Link href="/products" className="hover:underline">Catálogo</Link>
                <Link href="/contact" className="hover:underline">Contacto</Link>
            </nav>

            <div className="flex-1 flex justify-end">
                <Link href="/cart" className="relative">
                    🛒
                    {totalItems > 0 && (
                        <span className="absolute -top-2 -right-3 bg-red-500 text-xs px-2 py-0.5 rounded-full">
                        {totalItems}
                        </span>
                    )}
                </Link>
            </div>
        </header>
    );
}