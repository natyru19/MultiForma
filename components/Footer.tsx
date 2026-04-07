export default function Footer() {
  return (
        <footer className="mt-10 border-t p-6">
        <div className="flex justify-between">
            <div>
            <p className="font-bold">MultiForma</p>
            <p>Seguinos en Instagram</p>
            </div>

            <div className="flex flex-col gap-2">
            <a href="#">Contáctanos</a>
            <a href="#">Mis compras</a>
            <a href="#">Términos</a>
            <a href="#">Privacidad</a>
            </div>
        </div>

        <div className="mt-4 text-center text-sm">
            © MultiForma 2026 - Desarrollado por Natalia Rubio
        </div>
        </footer>
    );
}