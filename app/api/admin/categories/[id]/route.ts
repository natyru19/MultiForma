import { NextResponse } from "next/server";
import { requireAdmin, rlsErrorResponse } from "@/app/lib/adminApi";
import { slugify } from "@/lib/slugify";
import { supabaseAdmin } from "@/lib/supabase/admin";

type RouteContext = {
    params: Promise<{ id: string }>;
};

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

export async function DELETE(_req: Request, context: RouteContext) {
    try {
        const auth = await requireAdmin();
        if ("error" in auth && auth.error) return auth.error;

        const { db } = auth;
        const { id } = await context.params;

        const { count: productsCount, error: productsError } = await db
            .from("products")
            .select("*", { count: "exact", head: true })
            .eq("category_id", id);

        if (productsError) {
            console.error("ERROR VERIFICANDO PRODUCTOS:", productsError);
            return NextResponse.json(
                { error: "Error al verificar productos de la categoría" },
                { status: 500 }
            );
        }

        if (productsCount && productsCount > 0) {
            return NextResponse.json(
                {
                    error: "No se puede eliminar: la categoría tiene productos asociados. Desactivala en su lugar.",
                },
                { status: 409 }
            );
        }

        const { error: deleteError } = await db
            .from("categories")
            .delete()
            .eq("id", id);

        if (deleteError) {
            console.error("ERROR ELIMINANDO CATEGORÍA:", deleteError);
            if (deleteError.code === "42501") {
                return rlsErrorResponse("la categoría");
            }
            return NextResponse.json(
                { error: "Error al eliminar la categoría" },
                { status: 500 }
            );
        }

        return NextResponse.json({ message: "Categoría eliminada" });
    } catch (error) {
        console.error("ERROR API DELETE CATEGORY:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: Request, context: RouteContext) {
    try {
        const auth = await requireAdmin();
        if ("error" in auth && auth.error) return auth.error;

        const { db } = auth;
        const { id } = await context.params;
        const body = await req.json();

        if (typeof body.active === "boolean") {
            const { data: category, error } = await db
                .from("categories")
                .update({ active: body.active })
                .eq("id", id)
                .select()
                .single();

            if (error) {
                console.error("ERROR ACTUALIZANDO ESTADO CATEGORÍA:", error);
                if (error.code === "42501") {
                    return rlsErrorResponse("la categoría");
                }
                return NextResponse.json(
                    { error: "Error al actualizar el estado" },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                message: body.active
                    ? "Categoría activada"
                    : "Categoría desactivada",
                data: category,
            });
        }

        const name = String(body.name ?? "").trim();
        const image = body.image?.trim() || null;

        if (!name) {
            return NextResponse.json(
                { error: "El nombre es obligatorio" },
                { status: 400 }
            );
        }

        const { data: current, error: currentError } = await db
            .from("categories")
            .select("name, slug")
            .eq("id", id)
            .single();

        if (currentError || !current) {
            return NextResponse.json(
                { error: "Categoría no encontrada" },
                { status: 404 }
            );
        }

        const slug =
            slugify(name) === slugify(current.name)
                ? current.slug
                : await generateUniqueSlug(db, name, id);

        const { data: category, error } = await db
            .from("categories")
            .update({
                name,
                slug,
                image,
            })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("ERROR ACTUALIZANDO CATEGORÍA:", error);
            if (error.code === "42501") return rlsErrorResponse("la categoría");
            return NextResponse.json(
                { error: "Error al actualizar la categoría" },
                { status: 500 }
            );
        }

        if (slug !== current.slug) {
            await db
                .from("products")
                .update({ category_slug: slug })
                .eq("category_id", id);
        }

        return NextResponse.json({
            message: "Categoría actualizada",
            data: category,
        });
    } catch (error) {
        console.error("ERROR API PATCH CATEGORY:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
