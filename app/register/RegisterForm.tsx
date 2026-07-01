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
    const isWelcomePromo = redirectTo === "/products";

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loginHref = redirectTo.startsWith("/login")
        ? redirectTo
        : `/login?redirect=${encodeURIComponent(redirectTo)}`;

    async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        const trimmedName = fullName.trim();
        const trimmedEmail = email.trim();

        if (!trimmedName) {
            setError("Ingresá tu nombre completo");
            return;
        }

        if (!trimmedEmail) {
            setError("Ingresá tu email");
            return;
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);

        const { data, error: signUpError } = await supabase.auth.signUp({
            email: trimmedEmail,
            password,
            options: {
                data: {
                    full_name: trimmedName,
                },
            },
        });

        if (signUpError) {
            setLoading(false);
            setError(signUpError.message);
            return;
        }

        if (!data.user) {
            setLoading(false);
            setError("No se pudo crear la cuenta");
            return;
        }

        const profileResponse = await fetch("/api/profile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: data.user.id,
                email: trimmedEmail,
                full_name: trimmedName,
            }),
        });

        if (!profileResponse.ok) {
            const profileData = await profileResponse.json();
            setLoading(false);
            setError(profileData.error || "No se pudo guardar tu perfil");
            return;
        }

        const cartId = localStorage.getItem("cart_id");

        if (cartId) {
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

        setLoading(false);

        router.push(loginHref);
        router.refresh();
    }

    return (
        <main className="max-w-md mx-auto p-6">
            <BackLink href={loginHref} label="Iniciar sesión" className="mb-6" />

            <h1 className="text-3xl font-bold mb-2">Registro</h1>
            <p className="text-gray-600 mb-6">
                {isWelcomePromo
                    ? "Creá tu cuenta y obtené 10% de descuento en tu primera compra."
                    : "Creá tu cuenta para comprar y ver tus pedidos."}
            </p>

            <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <div>
                    <label htmlFor="full_name" className="block mb-1 font-medium">
                        Nombre completo
                    </label>
                    <input
                        id="full_name"
                        type="text"
                        autoComplete="name"
                        className="w-full border p-3 rounded"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block mb-1 font-medium">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        className="w-full border p-3 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block mb-1 font-medium">
                        Contraseña
                    </label>
                    <input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        className="w-full border p-3 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={6}
                        required
                    />
                </div>

                <div>
                    <label
                        htmlFor="confirm_password"
                        className="block mb-1 font-medium"
                    >
                        Confirmar contraseña
                    </label>
                    <input
                        id="confirm_password"
                        type="password"
                        autoComplete="new-password"
                        className="w-full border p-3 rounded"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        minLength={6}
                        required
                    />
                </div>

                {error && (
                    <p className="text-red-600 text-sm" role="alert">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white p-3 rounded disabled:opacity-60"
                >
                    {loading ? "Registrando..." : "Registrarse"}
                </button>
            </form>

            <p className="mt-6 text-sm text-gray-500 text-center">
                ¿Ya tenés cuenta?{" "}
                <Link href={loginHref} className="underline">
                    Iniciar sesión
                </Link>
            </p>
        </main>
    );
}
