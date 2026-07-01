import { supabaseAdmin } from "@/lib/supabase/admin";
import { stockService } from "@/app/services/stock.service";
import {
    applyWelcomeDiscountToCart,
    markWelcomeDiscountUsed,
} from "@/app/services/discount.service";

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
    welcomeDiscountApplied?: boolean;
    subtotal?: number;
    discountAmount?: number;
};

export const orderService = {
    async createOrder({
        cart,
        form,
        paymentId,
        userId,
        welcomeDiscountApplied = false,
        subtotal,
        discountAmount = 0,
    }: CreateOrderParams) {
        const pricedCart = welcomeDiscountApplied
            ? applyWelcomeDiscountToCart(cart)
            : cart;

        await stockService.validateCartStock(pricedCart);

        const orderSubtotal =
            subtotal ??
            cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

        const total = pricedCart.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );

        const paymentIdStr = String(paymentId);

        const { data: createdOrder, error: orderError } = await supabaseAdmin
            .from("orders")
            .insert({
                name: form.name,
                email: form.email,
                phone: form.phone,
                address: form.address,
                subtotal: orderSubtotal,
                discount_amount: discountAmount,
                total,
                payment_id: paymentIdStr,
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
                    .eq("payment_id", paymentIdStr)
                    .single();

                return duplicateOrder;
            }

            console.error("ERROR CREANDO ORDER:", orderError);
            throw orderError;
        }

        try {
            await stockService.deductForCartItems(pricedCart);

            const orderItems = pricedCart.map((item) => ({
                order_id: createdOrder.id,
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
            for (const item of pricedCart) {
                if (item.variant_id) {
                    await stockService.restoreStock(
                        item.variant_id,
                        item.quantity
                    );
                }
            }

            await supabaseAdmin
                .from("orders")
                .delete()
                .eq("id", createdOrder.id);

            throw error;
        }

        console.log("ORDEN CREADA:", createdOrder.id);

        if (welcomeDiscountApplied && userId) {
            await markWelcomeDiscountUsed(userId);
        }

        return createdOrder;
    },
};
