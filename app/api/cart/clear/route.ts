import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function DELETE(req: Request) {
    try {
        const { cart_id } = await req.json();

        if (!cart_id) {
        return NextResponse.json(
            { error: "cart_id requerido" },
            { status: 400 }
        );
        }

        await supabase
        .from("cart_items")
        .delete()
        .eq("cart_id", cart_id);

        return NextResponse.json({ message: "Carrito limpiado" });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
        { error: "Error limpiando carrito" },
        { status: 500 }
        );
    }
}