import Link from "next/link";

export default function HomePromoBanner() {
    return (
        <Link
            href="/register?redirect=/checkout"
            className="inline-block mt-6 bg-[var(--accent)] hover:bg-[var(--accent-hover)] font-semibold px-6 py-2 rounded transition"
        >
            Creá tu cuenta — 10% en tu primera compra
        </Link>
    );
}
