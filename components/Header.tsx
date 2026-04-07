import Link from "next/link";

export default function Header() {
    return (
        <header className="flex justify-between items-center p-4 border-b">
            <div className="font-bold">MF</div>

            <h1 className="text-xl font-semibold">MultiForma</h1>

            <nav className="flex gap-4">
                <Link href="/productos">Productos</Link>
                <Link href="/contacto">Contacto</Link>
            </nav>
        </header>
    );
}