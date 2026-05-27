import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {

    try {

        const { cartId, userId } = await req.json();

        if (!cartId || !userId) {

            return NextResponse.json(
                {
                    error: "Faltan datos",
                },
                {
                    status: 400,
                }
            );
        }

        const { error } = await supabaseAdmin
            .from("carts")
            .update({
                user_id: userId,
            })
            .eq("id", cartId);

        if (error) {

            console.error(error);

            return NextResponse.json(
                {
                    error: "Error asociando carrito",
                },
                {
                    status: 500,
                }
            );
        }

        return NextResponse.json({
            message: "Carrito asociado correctamente",
        });

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                error: "Error interno",
            },
            {
                status: 500,
            }
        );
    }
}