import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { stockService, StockError } from "@/app/services/stock.service";
import { getMercadoPagoUrls } from "@/lib/appUrl";
import {
    applyWelcomeDiscountToCart,
    getWelcomeDiscountSummary,
} from "@/app/services/discount.service";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { cartId, form, userId } = body;

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
            .select(`
                *,
                products (name)
            `)
            .eq("cart_id", cartId);

        if (cartError || !cartItems?.length) {
            return NextResponse.json(
                { error: "El carrito está vacío" },
                { status: 400 }
            );
        }

        await stockService.validateCartStock(cartItems);

        const discountSummary = await getWelcomeDiscountSummary(
            userId,
            cartItems.map((item) => ({
                price: Number(item.price),
                quantity: item.quantity,
            }))
        );

        const pricedCart = discountSummary.eligible
            ? applyWelcomeDiscountToCart(
                  cartItems.map((item) => ({
                      ...item,
                      price: Number(item.price),
                  }))
              )
            : cartItems.map((item) => ({
                  ...item,
                  price: Number(item.price),
              }));

        const mpItems = pricedCart.map((item) => ({
            title:
                (item.products as { name?: string } | null)?.name || "Producto",
            quantity: item.quantity,
            unit_price: item.price,
            currency_id: "UYU",
        }));

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
                    items: mpItems,
                    external_reference: String(cartId),
                    notification_url: mpUrls.notification_url,
                    metadata: {
                        cart_id: String(cartId),
                        user_id: String(userId || ""),
                        customer_name: String(form.name || ""),
                        customer_email: String(form.email || ""),
                        customer_phone: String(form.phone || ""),
                        customer_address: String(form.address || ""),
                        welcome_discount_applied: discountSummary.eligible
                            ? "true"
                            : "false",
                        discount_amount: String(discountSummary.discountAmount),
                        discount_percent: String(discountSummary.discountPercent),
                        subtotal: String(discountSummary.subtotal),
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

        const checkoutUrl =
            mpUrls.mode === "local" && data.sandbox_init_point
                ? data.sandbox_init_point
                : data.init_point;

        return NextResponse.json({
            ...data,
            checkout_url: checkoutUrl,
            mp_mode: mpUrls.mode,
            discount: discountSummary,
        });
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
