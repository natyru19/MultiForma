import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {

        const body = await req.json();

        console.log("WEBHOOK MP:", body);

        const paymentId =
            body?.data?.id || body?.resource;

        if (!paymentId) {
            return NextResponse.json({
                message: "No payment id",
            });
        }

        const response = await fetch(
            `https://api.mercadopago.com/v1/payments/${paymentId}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
                },
            }
        );

        const payment = await response.json();

        console.log("PAYMENT INFO:", payment);

        return NextResponse.json({
            message: "Webhook recibido",
        });

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { error: "Error webhook" },
            { status: 500 }
        );
    }
}