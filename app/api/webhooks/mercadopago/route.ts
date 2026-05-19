import { NextResponse } from "next/server";

import { orderService } from "@/app/services/order.service";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {

    try {

        const { searchParams } = new URL(req.url);

        const topic = searchParams.get("topic");

        console.log("TOPIC:", topic);

        if (topic === "merchant_order") {
            return NextResponse.json({ ok: true });
        }

        const body = await req.json();

        console.log("WEBHOOK MP:", body);
        
        const paymentId =
            body?.data?.id || body?.resource;

        console.log("PAYMENT ID:", paymentId);

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

        if (payment.status !== "approved") {

            return NextResponse.json({
                message: "Pago no aprobado",
            });
        }

        const cartId = payment.metadata?.cart_id;

        const customer = payment.metadata?.customer;

        const userId = payment.metadata?.user_id;

        if (!cartId || !customer) {

            return NextResponse.json({
                message: "Faltan datos del carrito o cliente",
            });
        }

        const { data: cartItems, error: cartError } = await supabaseAdmin
            .from("cart_items")
            .select("*")
            .eq("cart_id", cartId);

        console.log("CART ITEMS:", cartItems);

        if (cartError) {

            console.error("ERROR OBTENIENDO CART ITEMS:", cartError);

            throw cartError;
        }

        if (!cartItems || cartItems.length === 0) {

            return NextResponse.json({
                message: "Carrito vacío",
            });
        }

        const { data: existingOrder, error: existingOrderError } = await supabaseAdmin
            .from("orders")
            .select("*")
            .eq("payment_id", paymentId)
            .maybeSingle();

        if (existingOrderError) {
            console.error("ERROR OBTENIENDO ORDEN EXISTENTE:", existingOrderError);
        }

        if (existingOrder) {
            console.log("La orden ya existe");

            return NextResponse.json({
                message: "Orden ya procesada"
            });
        }

        await orderService.createOrder({
            cart: cartItems,
            form: customer,
            userId,
            paymentId,
        });

        const { error: deleteItemsError } = await supabaseAdmin
            .from("cart_items")
            .delete()
            .eq("cart_id", cartId);

        if (deleteItemsError) {

            console.error(
                "ERROR ELIMINANDO CART ITEMS:",
                deleteItemsError
            );

            throw deleteItemsError;
        }

        const { error: deleteCartError } = await supabaseAdmin
            .from("carts")
            .delete()
            .eq("id", cartId);

        if (deleteCartError) {

            console.error(
                "ERROR ELIMINANDO CART:",
                deleteCartError
            );

            throw deleteCartError;
        }

        console.log("CARRITO LIMPIADO");

        return NextResponse.json({
            message: "Webhook procesado correctamente",
        });

    } catch (error) {

        console.error("ERROR WEBHOOK:", error);

        return NextResponse.json(
            {
                error: "Error webhook",
            },
            {
                status: 500,
            }
        );
    }
}