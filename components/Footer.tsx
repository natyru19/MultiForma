export default function Footer() {
  return (
        <footer className="mt-10 border-t p-9 bg-[var(--primary-dark)] text-white shadow-md">
        <div className="flex justify-between">
            <div>
                <p className="font-bold">MultiForma</p>
                <p>Seguinos en Instagram</p>
                <a 
                    href="https://www.instagram.com/multiforma.uy"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img 
                    className="w-8 h-8" 
                    src="https://rnyawemxuljswnfoepnj.supabase.co/storage/v1/object/public/product-images/logoInstagram.png" 
                    alt="Instagram"
                    />    
                </a>
            </div>

            <div className="flex flex-col gap-2">
                <a href="#">Contáctanos</a>
                <a href="#">Mis compras</a>
                <a href="#">Términos</a>
                <a href="#">Privacidad</a>
            </div>
        </div>

        <div className="mt-6 pt-10 text-center text-sm border-t border-gray-300">
            © MultiForma 2026 - Todos los derechos reservados. | Montevideo, Uruguay | Desarrollado por Natalia Rubio.
        </div>
        </footer>
    );
}