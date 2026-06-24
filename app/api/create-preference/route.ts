import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { stockService, StockError } from "@/app/services/stock.service";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items, cartId, form, userId } = body;

        if (!cartId) {
            return NextResponse.json(
                { error: "Carrito no encontrado" },
                { status: 400 }
            );
        }

        const { data: cartItems, error: cartError } = await supabaseAdmin
            .from("cart_items")
            .select("*")
            .eq("cart_id", cartId);

        if (cartError || !cartItems?.length) {
            return NextResponse.json(
                { error: "El carrito está vacío" },
                { status: 400 }
            );
        }

        await stockService.validateCartStock(cartItems);

        const response = await fetch(
            "https://api.mercadopago.com/checkout/preferences",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
                },
                body: JSON.stringify({
                    items: items.map((item: { title: string; quantity: number; unit_price: number }) => ({
                        ...item,
                        currency_id: "UYU",
                    })),

                    notification_url: "https://squeak-sneeze-unviable.ngrok-free.dev/api/webhooks/mercadopago",
                    /*notification_url:
                        "https://multiforma-ecommerce.vercel.app/api/webhooks/mercadopago",*/

                    metadata: {
                        cart_id: cartId,
                        customer: form,
                        user_id: userId,
                    },

                    back_urls: {
                        success:
                            //"https://multiforma-ecommerce.vercel.app/success",
                            "https://squeak-sneeze-unviable.ngrok-free.dev/success",
                        failure: "https://multiforma-ecommerce.vercel.app",
                        pending: "https://multiforma-ecommerce.vercel.app",
                    },

                    auto_return: "approved",
                }),
            }
        );

        const data = await response.json();

        console.log("MP RESPONSE:", data);

        return NextResponse.json(data);
    } catch (error) {
        if (error instanceof StockError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        console.error("ERROR CREATE PREFERENCE:", error);
        return NextResponse.json(
            { error: "Error al iniciar el pago" },
            { status: 500 }
        );
    }
}
