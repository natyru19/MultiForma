"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const supabase = createClient();

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    async function handleLogin(e: any) {
        e.preventDefault();

        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        });

        setLoading(false);

        if (error) {
        alert(error.message);
        return;
        }

        router.push("/");
        router.refresh();
    }

    return (
        <main className="max-w-md mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">
                Iniciar sesión
            </h1>

            <form
                onSubmit={handleLogin}
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
                {loading ? "Ingresando..." : "Ingresar"}
                </button>
            </form>
        </main>
    );
}