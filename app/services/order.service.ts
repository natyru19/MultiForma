import { supabaseAdmin } from "@/lib/supabase/admin";
import { stockService } from "@/app/services/stock.service";

type CartItem = {
    product_id: string;
    variant_id?: string | null;
    quantity: number;
    price: number;
};

type CustomerForm = {
    name: string;
    email: string;
    phone: string;
    address: string;
};

type CreateOrderParams = {
    cart: CartItem[];
    form: CustomerForm;
    paymentId: string | number;
    userId?: string;
};

export const orderService = {
    async createOrder({
        cart,
        form,
        paymentId,
        userId,
    }: CreateOrderParams) {
        const { data: existingOrder } = await supabaseAdmin
            .from("orders")
            .select("id")
            .eq("payment_id", String(paymentId))
            .single();

        if (existingOrder) {
            console.log("La orden ya existe para este pago");
            return existingOrder;
        }

        await stockService.validateCartStock(cart);
        await stockService.deductForCartItems(cart);

        const total = cart.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );

        let order: { id: string } | null = null;

        try {
            const { data: createdOrder, error: orderError } = await supabaseAdmin
                .from("orders")
                .insert({
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    address: form.address,
                    total,
                    payment_id: String(paymentId),
                    user_id: userId || null,
                    status: "paid",
                })
                .select()
                .single();

            if (orderError) {
                if (orderError.code === "23505") {
                    console.log("La orden ya existe para este payment_id");

                    const { data: duplicateOrder } = await supabaseAdmin
                        .from("orders")
                        .select("*")
                        .eq("payment_id", String(paymentId))
                        .single();

                    return duplicateOrder;
                }

                console.error("ERROR CREANDO ORDER:", orderError);
                throw orderError;
            }

            order = createdOrder;

            const orderItems = cart.map((item) => ({
                order_id: order!.id,
                product_id: item.product_id,
                variant_id: item.variant_id || null,
                quantity: item.quantity,
                price: item.price,
            }));

            const { error: itemsError } = await supabaseAdmin
                .from("order_items")
                .insert(orderItems);

            if (itemsError) {
                console.error("ERROR CREANDO ORDER ITEMS:", itemsError);
                throw itemsError;
            }
        } catch (error) {
            for (const item of cart) {
                if (item.variant_id) {
                    await stockService.restoreStock(
                        item.variant_id,
                        item.quantity
                    );
                }
            }

            throw error;
        }

        console.log("ORDEN CREADA:", order!.id);

        return order;
    },
};
