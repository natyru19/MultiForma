import { NextResponse } from "next/server";
import { requireAdmin, rlsErrorResponse } from "@/app/lib/adminApi";

type RouteContext = {
    params: Promise<{ id: string }>;
};

type VariantInput = {
    price: number;
    stock: number;
    option?: string | null;
    color?: string | null;
    image?: string | null;
};

function validateVariant(variant: VariantInput) {
    if (
        variant.price === undefined ||
        variant.price === null ||
        variant.stock === undefined ||
        variant.stock === null
    ) {
        return "Precio y stock de la variante son obligatorios";
    }

    const price = Number(variant.price);
    const stock = Number(variant.stock);

    if (Number.isNaN(price) || price <= 0) {
        return "El precio debe ser un número mayor a 0";
    }

    if (Number.isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
        return "El stock debe ser un número entero mayor o igual a 0";
    }

    return null;
}

export async function POST(req: Request, context: RouteContext) {
    try {
        const auth = await requireAdmin();
        if ("error" in auth && auth.error) return auth.error;

        const { db } = auth;
        const { id: productId } = await context.params;
        const body = await req.json();
        const variant = body.variant as VariantInput;

        const validationError = validateVariant(variant);
        if (validationError) {
            return NextResponse.json({ error: validationError }, { status: 400 });
        }

        const { data: product, error: productError } = await db
            .from("products")
            .select("id, image")
            .eq("id", productId)
            .single();

        if (productError || !product) {
            return NextResponse.json(
                { error: "Producto no encontrado" },
                { status: 404 }
            );
        }

        const variantImage =
            variant.image?.trim() || product.image || null;

        const { data: createdVariant, error } = await db
            .from("variants")
            .insert({
                product_id: productId,
                price: Number(variant.price),
                stock: Number(variant.stock),
                option: variant.option?.trim() || null,
                color: variant.color?.trim() || null,
                image: variantImage,
            })
            .select()
            .single();

        if (error) {
            console.error("ERROR CREANDO VARIANTE:", error);
            if (error.code === "42501") return rlsErrorResponse("la variante");
            return NextResponse.json(
                { error: "Error al crear la variante" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: "Variante agregada correctamente",
            data: createdVariant,
        });
    } catch (error) {
        console.error("ERROR API POST VARIANT:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
