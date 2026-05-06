import { supabase } from "@/lib/supabase";

export const orderService = {
    async createOrder({
        cart,
        form,
    }: {
        cart: any[];
        form: any;
    }) {

        const total = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
        );

        const { data: order, error } = await supabase
        .from("orders")
        .insert({
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: form.address,
            total,
        })
        .select()
        .single();

        if (error) throw error;

        const items = cart.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        price: item.price,
        }));

        await supabase.from("order_items").insert(items);

        return order;
    },
};