import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
            items: body.items.map((item: any) => ({
                ...item,
                currency_id: "UYU",
            })),

            back_urls: {
                success: "http://localhost:3000/success",
                failure: "http://localhost:3000/failure",
                pending: "http://localhost:3000/pending",
            },

            //auto_return: "approved",
        }),
    });

    const data = await response.json();

    console.log("MP RESPONSE:", data);

    return NextResponse.json(data);
}