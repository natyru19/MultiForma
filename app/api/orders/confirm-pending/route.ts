import {
    confirmPendingByCartId,
    processApprovedPayment,
    processMerchantOrder,
} from "@/app/services/payment.service";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const cartId = body.cart_id || body.cartId;

        if (!cartId) {
            return Response.json(
                { error: "cart_id requerido" },
                { status: 400 }
            );
        }

        const result = await confirmPendingByCartId(String(cartId));

        if (!result.ok) {
            return Response.json(
                { error: result.message },
                { status: result.status ?? 400 }
            );
        }

        if (result.pending) {
            return Response.json(
                { error: result.message },
                { status: 202 }
            );
        }

        return Response.json({
            message: result.message,
            orderId: result.orderId,
        });
    } catch (error) {
        console.error("ERROR CONFIRM PENDING:", error);
        return Response.json(
            { error: "Error al confirmar la compra" },
            { status: 500 }
        );
    }
}
