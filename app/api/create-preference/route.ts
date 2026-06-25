import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { stockService, StockError } from "@/app/services/stock.service";
import { getMercadoPagoUrls } from "@/lib/appUrl";

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

        if (!form?.name?.trim() || !form?.email?.trim()) {
            return NextResponse.json(
                { error: "Completá nombre y email antes de pagar" },
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

        let mpUrls;

        try {
            mpUrls = getMercadoPagoUrls();
        } catch (urlError) {
            const message =
                urlError instanceof Error
                    ? urlError.message
                    : "Error de configuración de URLs";

            return NextResponse.json({ error: message }, { status: 500 });
        }

        console.log("MP URLS:", mpUrls.mode, mpUrls.baseUrl);

        const response = await fetch(
            "https://api.mercadopago.com/checkout/preferences",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
                },
                body: JSON.stringify({
                    items: items.map(
                        (item: {
                            title: string;
                            quantity: number;
                            unit_price: number;
                        }) => ({
                            ...item,
                            currency_id: "UYU",
                        })
                    ),

                    external_reference: String(cartId),

                    notification_url: mpUrls.notification_url,

                    metadata: {
                        cart_id: String(cartId),
                        user_id: String(userId || ""),
                        customer_name: String(form.name || ""),
                        customer_email: String(form.email || ""),
                        customer_phone: String(form.phone || ""),
                        customer_address: String(form.address || ""),
                    },

                    back_urls: mpUrls.back_urls,

                    auto_return: "approved",
                }),
            }
        );

        const data = await response.json();

        console.log("MP RESPONSE:", data);

        if (!response.ok) {
            console.error("MP ERROR:", data);
            return NextResponse.json(
                { error: data.message || "Error al crear preferencia de pago" },
                { status: response.status }
            );
        }

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
