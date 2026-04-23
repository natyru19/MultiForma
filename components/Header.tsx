import Link from "next/link";

export default function Header() {
    return (
        <header className="flex justify-between items-center p-4 border-b">
            <div className="font-bold">
                <Link href="/" className="flex items-center gap-2">
                    <img 
                        src="https://rnyawemxuljswnfoepnj.supabase.co/storage/v1/object/public/product-images/logoMF.jpeg" 
                        alt="MF"
                        className="w-30 h-30 object-cover rounded-xl border"
                />
                </Link>
            </div>

            <h1 className="text-xl font-semibold">MultiForma</h1>

            <nav className="flex gap-4">
                <Link href="/" className="hover:underline">Inicio</Link>
                <Link href="/productos" className="hover:underline">Catálogo</Link>
                <Link href="/contacto" className="hover:underline">Contacto</Link>
            </nav>
        </header>
    );
}