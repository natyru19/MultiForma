import { NextResponse } from "next/server";
import { requireAdmin, rlsErrorResponse } from "@/app/lib/adminApi";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, context: RouteContext) {
    try {
        const auth = await requireAdmin();
        if ("error" in auth && auth.error) return auth.error;

        const { db } = auth;
        const { id } = await context.params;
        const body = await req.json();

        const { name, description, image, category_id, featured } = body;

        if (!name || !description || !category_id) {
            return NextResponse.json(
                { error: "Faltan campos obligatorios del producto" },
                { status: 400 }
            );
        }

        const { data: category, error: categoryError } = await db
            .from("categories")
            .select("slug")
            .eq("id", category_id)
            .single();

        if (categoryError || !category) {
            return NextResponse.json(
                { error: "Categoría inválida" },
                { status: 400 }
            );
        }

        const { data: product, error } = await db
            .from("products")
            .update({
                name,
                description,
                image: image?.trim() || null,
                category_id,
                featured: featured ?? false,
                category_slug: category.slug,
            })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("ERROR ACTUALIZANDO PRODUCTO:", error);
            if (error.code === "42501") return rlsErrorResponse("el producto");
            return NextResponse.json(
                { error: "Error al actualizar el producto" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: "Producto actualizado",
            data: product,
        });
    } catch (error) {
        console.error("ERROR API PATCH PRODUCT:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
