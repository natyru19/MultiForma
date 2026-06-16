import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const { items, cartId, form, userId } = body;

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
            items: items.map((item: any) => ({
                ...item,
                currency_id: "UYU",
            })),

            //notification_url: "https://squeak-sneeze-unviable.ngrok-free.dev/api/webhooks/mercadopago",
            notification_url: "https://multiforma-ecommerce.vercel.app/api/webhooks/mercadopago",

            metadata: {
                cart_id: cartId,
                customer: form,
                user_id: userId,
            },

            
            back_urls: {
                success: "https://multiforma-ecommerce.vercel.app/success",
                failure: "https://multiforma-ecommerce.vercel.app",
                pending: "https://multiforma-ecommerce.vercel.app",
            },
            

            auto_return: "approved",
        }),
    });

    const data = await response.json();

    console.log("MP RESPONSE:", data);

    return NextResponse.json(data);
}