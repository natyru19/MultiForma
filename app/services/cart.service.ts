import { supabaseAdmin } from "@/lib/supabase/admin";

export const cartService = {
    async addToCart({
        product_id,
        variant_id,
        cart_id,
        quantity,
        price,
        user_id,
    }: {
        product_id: string;
        variant_id: string;
        cart_id?: string;
        quantity: number;
        price: number;
        user_id?: string;
    }) {
        
        let currentCartId = cart_id;

        if (!currentCartId) {
        const { data: newCart, error } = await supabaseAdmin
            .from('carts')
            .insert({
                user_id,
            })
            .select()
            .single();

        if (error) throw error;

        currentCartId = newCart.id;
        }

        const { data: existingItem } = await supabaseAdmin
        .from('cart_items')
        .select('*')
        .eq('cart_id', currentCartId)
        .eq('product_id', product_id)
        .eq('variant_id', variant_id)
        .maybeSingle();

        if (existingItem) {
        await supabaseAdmin
            .from('cart_items')
            .update({
            quantity: existingItem.quantity + quantity,
            })
            .eq('id', existingItem.id);
        } else {
        await supabaseAdmin
            .from('cart_items')
            .insert({
            cart_id: currentCartId,
            product_id,
            variant_id,
            quantity,
            price,
            });
        }

        const { data: cart } = await supabaseAdmin
        .from('cart_items')
        .select(`
            *,
            products (*),
            variants (*)
        `)
        .eq('cart_id', currentCartId);

        return {
        cart_id: currentCartId,
        items: cart,
        };
    },

    async updateQuantity(cart_item_id: string, quantity: number) {

        await supabaseAdmin
            .from("cart_items")
            .update({ quantity })
            .eq("id", cart_item_id);
    },

    async removeItem(cart_item_id: string) {

        await supabaseAdmin
            .from("cart_items")
            .delete()
            .eq("id", cart_item_id);
    },
};