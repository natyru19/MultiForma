import { NextResponse } from "next/server";
import { processApprovedPayment } from "@/app/services/payment.service";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const paymentId = body.payment_id || body.paymentId;

        if (!paymentId) {
            return NextResponse.json(
                { error: "payment_id requerido" },
                { status: 400 }
            );
        }

        const result = await processApprovedPayment(String(paymentId));

        if (!result.ok) {
            return NextResponse.json(
                { error: result.message },
                { status: result.status ?? 500 }
            );
        }

        if (result.pending) {
            return NextResponse.json(
                { error: result.message },
                { status: 202 }
            );
        }

        return NextResponse.json({
            message: result.message,
            orderId: result.orderId,
        });
    } catch (error) {
        console.error("ERROR CONFIRM ORDER:", error);
        return NextResponse.json(
            { error: "Error al confirmar la compra" },
            { status: 500 }
        );
    }
}
