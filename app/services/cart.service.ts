import { supabase } from '@/lib/supabase';

export const cartService = {
    async addToCart({
        product_id,
        cart_id,
        quantity,
    }: {
        product_id: string;
        cart_id?: string;
        quantity: number;
    }) {

        let currentCartId = cart_id;

        if (!currentCartId) {
        const { data: newCart, error } = await supabase
            .from('carts')
            .insert({})
            .select()
            .single();

        if (error) throw error;

        currentCartId = newCart.id;
        }

        const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('cart_id', currentCartId)
        .eq('product_id', product_id)
        .single();

        if (existingItem) {
        await supabase
            .from('cart_items')
            .update({
            quantity: existingItem.quantity + quantity,
            })
            .eq('id', existingItem.id);
        } else {
        await supabase
            .from('cart_items')
            .insert({
            cart_id: currentCartId,
            product_id,
            quantity,
            });
        }

        const { data: cart } = await supabase
        .from('cart_items')
        .select(`
            *,
            products (*)
        `)
        .eq('cart_id', currentCartId);

        return {
        cart_id: currentCartId,
        items: cart,
        };
    },
};