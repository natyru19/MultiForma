import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import BackLink from "@/components/BackLink";
import { WELCOME_DISCOUNT_PERCENT } from "@/app/services/discount.service";

type OrderItem = {
    quantity: number;
    price: number;
    original_price: number | null;
    products: { name: string } | null;
    variants: { option: string | null; color: string | null } | null;
};

type Order = {
    id: string;
    total: number;
    subtotal: number | null;
    discount_amount: number | null;
    created_at: string;
    order_items: OrderItem[];
};

function getOriginalUnitPrice(item: OrderItem, order: Order) {
    if (item.original_price != null) {
        return Number(item.original_price);
    }

    const discountAmount = Number(order.discount_amount || 0);
    if (discountAmount > 0) {
        return Math.round(
            Number(item.price) / (1 - WELCOME_DISCOUNT_PERCENT / 100)
        );
    }

    return Number(item.price);
}

export default async function OrdersPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: orders, error } = await supabase
        .from("orders")
        .select(`
            *,
            order_items (
                quantity,
                price,
                original_price,
                products (
                    name
                ),
                variants (
                    option,
                    color
                )
            )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
    }

    const orderList = (orders || []) as Order[];

    return (
        <div className="max-w-4xl mx-auto p-6 text-[var(--foreground)]">
            <BackLink href="/" label="Inicio" className="mb-6" />

            <h1 className="text-3xl font-bold mb-6">Mis compras</h1>

            <div className="space-y-6">
                {orderList.map((order) => {
                    const discountAmount = Number(order.discount_amount || 0);
                    const hasDiscount = discountAmount > 0;
                    const orderSubtotal =
                        order.subtotal ??
                        order.order_items.reduce((acc, item) => {
                            const originalUnit = getOriginalUnitPrice(
                                item,
                                order
                            );
                            return acc + originalUnit * item.quantity;
                        }, 0);

                    return (
                        <div
                            key={order.id}
                            className="rounded-lg border border-gray-200 bg-white p-5 text-[var(--dark)] shadow-sm space-y-4"
                        >
                            <div className="flex flex-wrap justify-between gap-2 text-sm">
                                <p>
                                    <span className="font-semibold">
                                        Pedido
                                    </span>{" "}
                                    <span className="text-[var(--muted)]">
                                        #{order.id.slice(0, 8)}
                                    </span>
                                </p>
                                <p className="text-[var(--muted)]">
                                    {new Date(
                                        order.created_at
                                    ).toLocaleDateString("es-UY", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>

                            <div className="space-y-3">
                                {order.order_items.map((item, index) => {
                                    const paidUnit = Number(item.price);
                                    const originalUnit = getOriginalUnitPrice(
                                        item,
                                        order
                                    );
                                    const unitDiscount = originalUnit - paidUnit;
                                    const showItemDiscount =
                                        hasDiscount && unitDiscount > 0;

                                    return (
                                        <div
                                            key={index}
                                            className="rounded border border-gray-200 bg-[var(--light)] p-3"
                                        >
                                            <p className="font-semibold text-[var(--dark)]">
                                                {item.products?.name}
                                            </p>

                                            {(item.variants?.option ||
                                                item.variants?.color) && (
                                                <p className="text-sm text-[var(--muted)]">
                                                    {item.variants?.option}
                                                    {item.variants?.color &&
                                                        ` | ${item.variants.color}`}
                                                </p>
                                            )}

                                            <p className="text-sm mt-1 text-[var(--dark)]">
                                                Cantidad: {item.quantity}
                                            </p>

                                            {showItemDiscount ? (
                                                <div className="text-sm mt-2 space-y-1">
                                                    <p className="text-[var(--dark)]">
                                                        Precio unitario:{" "}
                                                        <span className="line-through text-[var(--muted)]">
                                                            ${originalUnit}
                                                        </span>
                                                    </p>
                                                    <p className="text-[var(--accent)] font-medium">
                                                        Descuento primera
                                                        compra (
                                                        {WELCOME_DISCOUNT_PERCENT}
                                                        %): -${unitDiscount}{" "}
                                                        c/u
                                                    </p>
                                                    <p className="font-semibold text-[var(--dark)]">
                                                        Precio pagado: $
                                                        {paidUnit} c/u
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="text-sm mt-1 text-[var(--dark)]">
                                                    Precio unitario: $
                                                    {paidUnit}
                                                </p>
                                            )}

                                            <p className="text-sm font-semibold mt-2 text-[var(--primary-dark)]">
                                                Subtotal ítem: $
                                                {paidUnit * item.quantity}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="border-t border-gray-200 pt-4 space-y-2 max-w-sm ml-auto text-sm">
                                {hasDiscount && (
                                    <>
                                        <div className="flex justify-between text-[var(--dark)]">
                                            <span>Subtotal</span>
                                            <span>${orderSubtotal}</span>
                                        </div>
                                        <div className="flex justify-between text-[var(--accent)] font-medium">
                                            <span>
                                                Descuento primera compra (
                                                {WELCOME_DISCOUNT_PERCENT}%)
                                            </span>
                                            <span>- ${discountAmount}</span>
                                        </div>
                                    </>
                                )}
                                <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2 text-[var(--primary-dark)]">
                                    <span>Total pagado</span>
                                    <span>${order.total}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {orderList.length === 0 && (
                    <p className="text-[var(--muted)]">
                        No tenés compras todavía.
                    </p>
                )}
            </div>
        </div>
    );
}
