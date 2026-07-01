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
    status: string;
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
        <div className="max-w-4xl mx-auto p-6">
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
                            className="border rounded-lg p-5 space-y-4"
                        >
                            <div className="flex flex-wrap justify-between gap-2 text-sm text-gray-600">
                                <p>
                                    <span className="font-semibold text-gray-900">
                                        Pedido
                                    </span>{" "}
                                    #{order.id.slice(0, 8)}
                                </p>
                                <p>
                                    {new Date(
                                        order.created_at
                                    ).toLocaleDateString("es-UY")}
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
                                            className="border rounded p-3 bg-gray-50"
                                        >
                                            <p className="font-semibold">
                                                {item.products?.name}
                                            </p>

                                            {(item.variants?.option ||
                                                item.variants?.color) && (
                                                <p className="text-sm text-gray-500">
                                                    {item.variants?.option}
                                                    {item.variants?.color &&
                                                        ` | ${item.variants.color}`}
                                                </p>
                                            )}

                                            <p className="text-sm mt-1">
                                                Cantidad: {item.quantity}
                                            </p>

                                            {showItemDiscount ? (
                                                <div className="text-sm mt-2 space-y-1">
                                                    <p>
                                                        Precio unitario:{" "}
                                                        <span className="line-through text-gray-500">
                                                            ${originalUnit}
                                                        </span>
                                                    </p>
                                                    <p className="text-green-700">
                                                        Descuento primera
                                                        compra (
                                                        {WELCOME_DISCOUNT_PERCENT}
                                                        %): -${unitDiscount}{" "}
                                                        c/u
                                                    </p>
                                                    <p className="font-medium">
                                                        Precio pagado: $
                                                        {paidUnit} c/u
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="text-sm mt-1">
                                                    Precio unitario: $
                                                    {paidUnit}
                                                </p>
                                            )}

                                            <p className="text-sm font-medium mt-1">
                                                Subtotal ítem: $
                                                {paidUnit * item.quantity}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="border-t pt-4 space-y-1 max-w-sm ml-auto text-sm">
                                {hasDiscount && (
                                    <>
                                        <div className="flex justify-between">
                                            <span>Subtotal</span>
                                            <span>${orderSubtotal}</span>
                                        </div>
                                        <div className="flex justify-between text-green-700">
                                            <span>
                                                Descuento primera compra (
                                                {WELCOME_DISCOUNT_PERCENT}%)
                                            </span>
                                            <span>- ${discountAmount}</span>
                                        </div>
                                    </>
                                )}
                                <div className="flex justify-between text-base font-bold border-t pt-2">
                                    <span>Total pagado</span>
                                    <span>${order.total}</span>
                                </div>
                            </div>

                            <p className="text-sm text-gray-500">
                                Estado: {order.status}
                            </p>
                        </div>
                    );
                })}

                {orderList.length === 0 && (
                    <p>No tenés compras todavía.</p>
                )}
            </div>
        </div>
    );
}
