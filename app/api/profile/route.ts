import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const fullName = String(body.full_name ?? "").trim();
        const email = String(body.email ?? "").trim().toLowerCase();
        const userIdFromBody = body.user_id ? String(body.user_id) : null;

        if (!fullName || !email) {
            return NextResponse.json(
                { error: "Nombre y email son obligatorios" },
                { status: 400 }
            );
        }

        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        let userId = user?.id ?? null;

        if (!userId && userIdFromBody) {
            const { data: authData, error: authError } =
                await supabaseAdmin.auth.admin.getUserById(userIdFromBody);

            if (
                authError ||
                !authData.user ||
                authData.user.email?.toLowerCase() !== email
            ) {
                return NextResponse.json(
                    { error: "No se pudo verificar el usuario" },
                    { status: 403 }
                );
            }

            userId = authData.user.id;
        }

        if (!userId) {
            return NextResponse.json(
                { error: "Sesión no válida" },
                { status: 401 }
            );
        }

        if (user && user.id !== userId) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 403 }
            );
        }

        const { error } = await supabaseAdmin.from("profiles").upsert(
            {
                id: userId,
                email,
                full_name: fullName,
                role: "customer",
            },
            { onConflict: "id" }
        );

        if (error) {
            console.error("ERROR CREAR PROFILE:", error);
            return NextResponse.json(
                { error: "No se pudo guardar el perfil" },
                { status: 500 }
            );
        }

        return NextResponse.json({ message: "Perfil creado" });
    } catch (error) {
        console.error("ERROR PROFILE API:", error);
        return NextResponse.json(
            { error: "Error al crear el perfil" },
            { status: 500 }
        );
    }
}
