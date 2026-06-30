import { NextResponse } from "next/server";
import { requireAdmin, rlsErrorResponse } from "@/app/lib/adminApi";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function DELETE(_req: Request, context: RouteContext) {
    try {
        const auth = await requireAdmin();
        if ("error" in auth && auth.error) return auth.error;

        const { db } = auth;
        const { id } = await context.params;

        const { count: orderItemsCount, error: orderItemsError } = await db
            .from("order_items")
            .select("*", { count: "exact", head: true })
            .eq("product_id", id);

        if (orderItemsError) {
            console.error("ERROR VERIFICANDO PEDIDOS:", orderItemsError);
            return NextResponse.json(
                { error: "Error al verificar pedidos del producto" },
                { status: 500 }
            );
        }

        if (orderItemsCount && orderItemsCount > 0) {
            return NextResponse.json(
                {
                    error: "No se puede eliminar: el producto tiene pedidos asociados",
                },
                { status: 409 }
            );
        }

        const { error: cartItemsError } = await db
            .from("cart_items")
            .delete()
            .eq("product_id", id);

        if (cartItemsError) {
            console.error("ERROR ELIMINANDO CART ITEMS:", cartItemsError);
            if (cartItemsError.code === "42501") {
                return rlsErrorResponse("los items del carrito");
            }
            return NextResponse.json(
                { error: "Error al eliminar items del carrito" },
                { status: 500 }
            );
        }

        const { error: variantsError } = await db
            .from("variants")
            .delete()
            .eq("product_id", id);

        if (variantsError) {
            console.error("ERROR ELIMINANDO VARIANTES:", variantsError);
            if (variantsError.code === "42501") {
                return rlsErrorResponse("las variantes");
            }
            return NextResponse.json(
                { error: "Error al eliminar las variantes" },
                { status: 500 }
            );
        }

        const { error: productError } = await db
            .from("products")
            .delete()
            .eq("id", id);

        if (productError) {
            console.error("ERROR ELIMINANDO PRODUCTO:", productError);
            if (productError.code === "42501") {
                return rlsErrorResponse("el producto");
            }
            return NextResponse.json(
                { error: "Error al eliminar el producto" },
                { status: 500 }
            );
        }

        return NextResponse.json({ message: "Producto eliminado" });
    } catch (error) {
        console.error("ERROR API DELETE PRODUCT:", error);
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
