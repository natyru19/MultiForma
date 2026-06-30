import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

function getDbClient(hasServiceRole: boolean, userClient: Awaited<ReturnType<typeof createClient>>) {
    return hasServiceRole ? supabaseAdmin : userClient;
}

type VariantInput = {
    price: number;
    stock: number;
    option?: string | null;
    color?: string | null;
    image?: string | null;
};

export async function POST(req: Request) {
    try {
        const supabase = await createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "No autenticado" },
                { status: 401 }
            );
        }

        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profileError || !profile) {
            return NextResponse.json(
                { error: "No se pudo verificar el perfil" },
                { status: 403 }
            );
        }

        if (profile.role !== "admin") {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 403 }
            );
        }

        const body = await req.json();

        const {
            name,
            description,
            image,
            category_id,
            featured,
            variant,
        } = body as {
            name: string;
            description: string;
            image?: string;
            category_id: string;
            featured?: boolean;
            variant: VariantInput;
        };

        if (!name || !description || !category_id) {
            return NextResponse.json(
                { error: "Faltan campos obligatorios del producto" },
                { status: 400 }
            );
        }

        if (
            !variant ||
            variant.price === undefined ||
            variant.price === null ||
            variant.stock === undefined ||
            variant.stock === null
        ) {
            return NextResponse.json(
                { error: "Precio y stock de la variante son obligatorios" },
                { status: 400 }
            );
        }

        const price = Number(variant.price);
        const stock = Number(variant.stock);

        if (Number.isNaN(price) || price <= 0) {
            return NextResponse.json(
                { error: "El precio debe ser un número mayor a 0" },
                { status: 400 }
            );
        }

        if (Number.isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
            return NextResponse.json(
                { error: "El stock debe ser un número entero mayor o igual a 0" },
                { status: 400 }
            );
        }

        const hasServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
        const db = getDbClient(hasServiceRole, supabase);

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

        const productImage = image?.trim() || null;

        const { data: product, error } = await db
            .from("products")
            .insert({
                name,
                description,
                image: productImage,
                category_id,
                featured: featured ?? false,
                active: true,
                category_slug: category.slug,
            })
            .select()
            .single();

        if (error) {
            console.error("ERROR CREANDO PRODUCTO:", error);

            if (error.code === "42501") {
                return NextResponse.json(
                    {
                        error: "No se pudo guardar el producto. Configurá SUPABASE_SERVICE_ROLE_KEY en .env.local.",
                    },
                    { status: 500 }
                );
            }

            return NextResponse.json(
                { error: "Error al crear el producto. Intentá de nuevo." },
                { status: 500 }
            );
        }

        const variantImage =
            variant.image?.trim() || productImage || null;

        const { data: createdVariant, error: variantError } = await db
            .from("variants")
            .insert({
                product_id: product.id,
                price,
                stock,
                option: variant.option?.trim() || null,
                color: variant.color?.trim() || null,
                image: variantImage,
            })
            .select()
            .single();

        if (variantError) {
            console.error("ERROR CREANDO VARIANTE:", variantError);
            await db.from("products").delete().eq("id", product.id);

            if (variantError.code === "42501") {
                return NextResponse.json(
                    {
                        error: "No se pudo guardar la variante. Configurá SUPABASE_SERVICE_ROLE_KEY en .env.local.",
                    },
                    { status: 500 }
                );
            }

            return NextResponse.json(
                { error: "Error al crear la variante del producto. Intentá de nuevo." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: "Producto creado correctamente",
            data: { ...product, variants: [createdVariant] },
        });
    } catch (error) {
        console.error("ERROR API ADMIN PRODUCTS:", error);

        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
