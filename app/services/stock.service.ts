import { supabaseAdmin } from "@/lib/supabase/admin";

export class StockError extends Error {
    available: number;

    constructor(message: string, available = 0) {
        super(message);
        this.name = "StockError";
        this.available = available;
    }
}

type CartStockItem = {
    variant_id?: string | null;
    quantity: number;
};

export const stockService = {
    async getStock(variantId: string): Promise<number> {
        const { data, error } = await supabaseAdmin
            .from("variants")
            .select("stock")
            .eq("id", variantId)
            .single();

        if (error || !data) {
            throw new StockError("Variante no encontrada");
        }

        return data.stock;
    },

    async validateVariantStock(variantId: string, quantity: number) {
        const stock = await this.getStock(variantId);

        if (quantity > stock) {
            throw new StockError(
                `Stock insuficiente. Disponible: ${stock}`,
                stock
            );
        }

        return stock;
    },

    async validateCartStock(items: CartStockItem[]) {
        for (const item of items) {
            if (!item.variant_id) continue;
            await this.validateVariantStock(item.variant_id, item.quantity);
        }
    },

    async deductStock(variantId: string, quantity: number, retries = 3) {
        for (let attempt = 0; attempt < retries; attempt++) {
            const { data: variant, error } = await supabaseAdmin
                .from("variants")
                .select("stock")
                .eq("id", variantId)
                .single();

            if (error || !variant) {
                throw new StockError("Variante no encontrada");
            }

            if (variant.stock < quantity) {
                throw new StockError(
                    `Stock insuficiente. Disponible: ${variant.stock}`,
                    variant.stock
                );
            }

            const newStock = variant.stock - quantity;

            const { data: updated } = await supabaseAdmin
                .from("variants")
                .update({ stock: newStock })
                .eq("id", variantId)
                .eq("stock", variant.stock)
                .select()
                .maybeSingle();

            if (updated) return updated;

            if (attempt === retries - 1) {
                throw new StockError("No se pudo actualizar el stock");
            }
        }
    },

    async restoreStock(variantId: string, quantity: number) {
        const { data: variant } = await supabaseAdmin
            .from("variants")
            .select("stock")
            .eq("id", variantId)
            .single();

        if (!variant) return;

        await supabaseAdmin
            .from("variants")
            .update({ stock: variant.stock + quantity })
            .eq("id", variantId);
    },

    async deductForCartItems(items: CartStockItem[]) {
        const deducted: CartStockItem[] = [];

        try {
            for (const item of items) {
                if (!item.variant_id) continue;
                await this.deductStock(item.variant_id, item.quantity);
                deducted.push(item);
            }
        } catch (error) {
            for (const item of deducted) {
                if (item.variant_id) {
                    await this.restoreStock(item.variant_id, item.quantity);
                }
            }
            throw error;
        }
    },
};
