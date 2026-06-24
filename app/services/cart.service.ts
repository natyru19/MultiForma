import { supabaseAdmin } from "@/lib/supabase/admin";
import { stockService, StockError } from "@/app/services/stock.service";

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
                .from("carts")
                .insert({
                    user_id,
                })
                .select()
                .single();

            if (error) throw error;

            currentCartId = newCart.id;
        }

        const { data: existingItem } = await supabaseAdmin
            .from("cart_items")
            .select("*")
            .eq("cart_id", currentCartId)
            .eq("product_id", product_id)
            .eq("variant_id", variant_id)
            .maybeSingle();

        const totalQuantity = (existingItem?.quantity ?? 0) + quantity;
        await stockService.validateVariantStock(variant_id, totalQuantity);

        if (existingItem) {
            await supabaseAdmin
                .from("cart_items")
                .update({
                    quantity: totalQuantity,
                })
                .eq("id", existingItem.id);
        } else {
            await supabaseAdmin.from("cart_items").insert({
                cart_id: currentCartId,
                product_id,
                variant_id,
                quantity,
                price,
            });
        }

        const { data: cart } = await supabaseAdmin
            .from("cart_items")
            .select(`
            *,
            products (*),
            variants (*)
        `)
            .eq("cart_id", currentCartId);

        return {
            cart_id: currentCartId,
            items: cart,
        };
    },

    async updateQuantity(cart_item_id: string, quantity: number) {
        const { data: cartItem, error } = await supabaseAdmin
            .from("cart_items")
            .select("variant_id")
            .eq("id", cart_item_id)
            .single();

        if (error || !cartItem?.variant_id) {
            throw new Error("Item de carrito no encontrado");
        }

        await stockService.validateVariantStock(cartItem.variant_id, quantity);

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

export { StockError };
