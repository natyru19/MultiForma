import { NextResponse } from "next/server";
import { orderService } from "@/app/services/order.service";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const order = await orderService.createOrder(body);

        return NextResponse.json({ data: order });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
        { error: "Error creando orden" },
        { status: 500 }
        );
    }
}