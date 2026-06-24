import Link from "next/link";

type Props = {
    href: string;
    label: string;
    className?: string;
};

export default function BackLink({ href, label, className = "" }: Props) {
    return (
        <Link
            href={href}
            className={`inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 hover:underline ${className}`}
        >
            ← {label}
        </Link>
    );
}
