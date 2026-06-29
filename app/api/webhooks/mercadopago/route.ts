import { NextResponse } from "next/server";
import {
    extractPaymentIdFromWebhook,
    processApprovedPayment,
    processMerchantOrder,
} from "@/app/services/payment.service";

export async function POST(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const topic =
            searchParams.get("topic") ||
            searchParams.get("type") ||
            searchParams.get("action");

        let body: Record<string, unknown> = {};

        try {
            body = await req.json();
        } catch {
            body = {};
        }

        console.log("WEBHOOK MP:", { topic, body });

        if (topic === "merchant_order") {
            const merchantOrderId = extractPaymentIdFromWebhook(req, body);

            if (!merchantOrderId) {
                return NextResponse.json({ message: "No merchant order id" });
            }

            const result = await processMerchantOrder(merchantOrderId);

            if (result.ok && result.pending) {
                console.log("WEBHOOK MERCHANT ORDER PENDING:", result.message);
                return NextResponse.json({
                    message: result.message,
                    pending: true,
                });
            }

            if (!result.ok) {
                console.error("WEBHOOK MERCHANT ORDER FAILED:", result.message);
                return NextResponse.json(
                    { error: result.message },
                    { status: result.status ?? 500 }
                );
            }

            return NextResponse.json({
                message: result.message,
                orderId: result.orderId,
            });
        }

        const paymentId = extractPaymentIdFromWebhook(req, body);

        if (!paymentId) {
            return NextResponse.json({ message: "No payment id" });
        }

        const result = await processApprovedPayment(paymentId);

        if (result.ok && result.pending) {
            console.log("WEBHOOK PAYMENT PENDING:", result.message);
            return NextResponse.json({
                message: result.message,
                pending: true,
            });
        }

        if (!result.ok) {
            console.error("WEBHOOK PAYMENT FAILED:", result.message);
            return NextResponse.json(
                { error: result.message },
                { status: result.status ?? 500 }
            );
        }

        return NextResponse.json({
            message: result.message,
            orderId: result.orderId,
        });
    } catch (error) {
        console.error("ERROR WEBHOOK:", error);

        return NextResponse.json(
            { error: "Error webhook" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    return POST(req);
}
