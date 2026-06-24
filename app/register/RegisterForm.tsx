"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import BackLink from "@/components/BackLink";
import Link from "next/link";

export default function RegisterForm() {
    const supabase = createClient();

    const router = useRouter();
    const searchParams = useSearchParams();

    const redirectTo = searchParams.get("redirect") || "/login";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    async function handleRegister(e: any) {
        e.preventDefault();

        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
        email,
        password,
        });

        setLoading(false);

        if (error) {
        alert(error.message);
        return;
        }

        alert("Usuario registrado correctamente");

        const cartId = localStorage.getItem("cart_id");

        if (cartId && data.user) {

            await fetch("/api/cart/associate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    cartId,
                    userId: data.user.id,
                }),
            });
        }

        router.push(
            redirectTo.startsWith("/login")
                ? redirectTo
                : `/login?redirect=${encodeURIComponent(redirectTo)}`
        );
    }

    return (
        <main className="max-w-md mx-auto p-6">
            <BackLink
                href={
                    redirectTo.startsWith("/login")
                        ? redirectTo
                        : `/login?redirect=${encodeURIComponent(redirectTo)}`
                }
                label="Iniciar sesión"
                className="mb-6"
            />

            <h1 className="text-3xl font-bold mb-6">
                Crear cuenta
            </h1>

            <form
                onSubmit={handleRegister}
                className="flex flex-col gap-4"
            >
                <input
                type="email"
                placeholder="Email"
                className="border p-3 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />

                <input
                type="password"
                placeholder="Contraseña"
                className="border p-3 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />

                <button
                type="submit"
                disabled={loading}
                className="bg-black text-white p-3 rounded"
                >
                {loading ? "Creando cuenta..." : "Registrarse"}
                </button>
            </form>

            <p className="mt-6 text-sm text-gray-500 text-center">
                ¿Ya tenés cuenta?{" "}
                <Link
                    href={
                        redirectTo.startsWith("/login")
                            ? redirectTo
                            : `/login?redirect=${encodeURIComponent(redirectTo)}`
                    }
                    className="underline"
                >
                    Iniciar sesión
                </Link>
            </p>
        </main>
    );
}