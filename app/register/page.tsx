"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {

    const supabase = createClient();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleRegister() {

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        console.log(data);

        console.log(error);
    }

    return (
        <div>
            <h1>Registro</h1>

            <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleRegister}>
                Registrarse
            </button>
        </div>
    );
}