import { NextResponse } from "next/server";
import { requireAdmin, rlsErrorResponse } from "@/app/lib/adminApi";
import { slugify } from "@/lib/slugify";
import { supabaseAdmin } from "@/lib/supabase/admin";

async function generateUniqueSlug(
    db: typeof supabaseAdmin,
    name: string,
    excludeId?: string
) {
    let base = slugify(name);
    if (!base) base = "categoria";

    let slug = base;
    let counter = 2;

    while (true) {
        const { data } = await db
            .from("categories")
            .select("id")
            .eq("slug", slug)
            .maybeSingle();

        if (!data || (excludeId && data.id === excludeId)) {
            return slug;
        }

        slug = `${base}-${counter}`;
        counter++;
    }
}

export async function POST(req: Request) {
    try {
        const auth = await requireAdmin();
        if ("error" in auth && auth.error) return auth.error;

        const { db } = auth;
        const body = await req.json();
        const name = String(body.name ?? "").trim();
        const image = body.image?.trim() || null;

        if (!name) {
            return NextResponse.json(
                { error: "El nombre es obligatorio" },
                { status: 400 }
            );
        }

        const slug = await generateUniqueSlug(db, name);

        const { data: category, error } = await db
            .from("categories")
            .insert({
                name,
                slug,
                image,
                active: true,
            })
            .select()
            .single();

        if (error) {
            console.error("ERROR CREANDO CATEGORÍA:", error);
            if (error.code === "42501") return rlsErrorResponse("la categoría");
            return NextResponse.json(
                { error: "Error al crear la categoría" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: "Categoría creada",
            data: category,
        });
    } catch (error) {
        console.error("ERROR API POST CATEGORIES:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
