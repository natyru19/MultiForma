import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { createClient } from "@/lib/supabase/server";

export default async function Navbar() {

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <nav className="w-full border-b p-4 flex justify-between items-center">

            <Link
                href="/"
                className="font-bold text-xl"
            >
            </Link>

            <div className="flex gap-4 items-center">

                {user ? (
                    <>
                        <Link href="/orders">
                            Mis compras
                        </Link>

                        <LogoutButton />
                    </>
                ) : (
                    <>
                        <Link href="/login">
                            Login
                        </Link>

                        <Link href="/register">
                            Registro
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}