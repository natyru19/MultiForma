import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getWelcomeDiscountSummary } from "@/app/services/discount.service";

export async function GET(req: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "No autenticado" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const cartId = searchParams.get("cart_id");

        if (!cartId) {
            return NextResponse.json(
                { error: "cart_id requerido" },
                { status: 400 }
            );
        }

        const { data: cartItems, error } = await supabaseAdmin
            .from("cart_items")
            .select("price, quantity")
            .eq("cart_id", cartId);

        if (error) {
            console.error("ERROR LEYENDO CARRITO PARA DESCUENTO:", error);
            return NextResponse.json(
                { error: "No se pudo leer el carrito" },
                { status: 500 }
            );
        }

        const summary = await getWelcomeDiscountSummary(user.id, cartItems || []);

        return NextResponse.json(summary);
    } catch (error) {
        console.error("ERROR API WELCOME DISCOUNT:", error);
        return NextResponse.json(
            { error: "Error al calcular el descuento" },
            { status: 500 }
        );
    }
}
