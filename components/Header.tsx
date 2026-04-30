import Link from "next/link";

export default function Header() {
    return (
        <header className="flex justify-between items-center p-8 border-b bg-[var(--primary-dark)] text-white shadow-md">
            <div className="font-bold">
                <Link href="/" className="flex items-center gap-2">
                    <img 
                        src="https://rnyawemxuljswnfoepnj.supabase.co/storage/v1/object/public/product-images/logoMF.jpeg" 
                        alt="MF"
                        className="w-28 h-28 object-cover rounded-xl border-black"
                />
                </Link>
            </div>

            <nav className="flex gap-4 hover:text-gray-200">
                <Link href="/" className="hover:underline">Inicio</Link>
                <Link href="/products" className="hover:underline">Catálogo</Link>
                <Link href="/contact" className="hover:underline">Contacto</Link>
            </nav>
        </header>
    );
}