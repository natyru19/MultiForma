import { supabaseAdmin } from "@/lib/supabase/admin";

export const WELCOME_DISCOUNT_PERCENT = 10;

export type WelcomeDiscountSummary = {
    eligible: boolean;
    subtotal: number;
    discountPercent: number;
    discountAmount: number;
    total: number;
};

type CartLine = {
    price: number;
    quantity: number;
};

export function calculateWelcomeDiscount(subtotal: number): Omit<
    WelcomeDiscountSummary,
    "eligible"
> {
    const discountAmount = Math.round(
        (subtotal * WELCOME_DISCOUNT_PERCENT) / 100
    );
    const total = subtotal - discountAmount;

    return {
        subtotal,
        discountPercent: WELCOME_DISCOUNT_PERCENT,
        discountAmount,
        total,
    };
}

export function applyWelcomeDiscountToPrice(price: number) {
    return Math.round(price * (100 - WELCOME_DISCOUNT_PERCENT) / 100);
}

export function applyWelcomeDiscountToCart<T extends CartLine>(cart: T[]): T[] {
    return cart.map((item) => ({
        ...item,
        price: applyWelcomeDiscountToPrice(item.price),
    }));
}

export async function isWelcomeDiscountEligible(userId?: string | null) {
    if (!userId) return false;

    const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("welcome_discount_used")
        .eq("id", userId)
        .maybeSingle();

    if (profile?.welcome_discount_used) {
        return false;
    }

    const { count, error } = await supabaseAdmin
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

    if (error) {
        console.error("ERROR VERIFICANDO ÓRDENES PARA DESCUENTO:", error);
        return false;
    }

    return (count ?? 0) === 0;
}

export async function getWelcomeDiscountSummary(
    userId: string | null | undefined,
    cart: CartLine[]
): Promise<WelcomeDiscountSummary> {
    const subtotal = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const eligible = await isWelcomeDiscountEligible(userId);

    if (!eligible) {
        return {
            eligible: false,
            subtotal,
            discountPercent: 0,
            discountAmount: 0,
            total: subtotal,
        };
    }

    return {
        eligible: true,
        ...calculateWelcomeDiscount(subtotal),
    };
}

export async function markWelcomeDiscountUsed(userId: string) {
    const { error } = await supabaseAdmin
        .from("profiles")
        .update({ welcome_discount_used: true })
        .eq("id", userId);

    if (error) {
        console.error("ERROR MARCANDO DESCUENTO USADO:", error);
    }
}
