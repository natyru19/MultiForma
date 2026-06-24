import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import BackLink from "@/components/BackLink";

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

    return (
        <div className="max-w-4xl mx-auto p-6">
            <BackLink href="/" label="Inicio" className="mb-6" />

            <h1 className="text-3xl font-bold mb-6">
                Mis compras
            </h1>

            <div className="space-y-4">
                {orders?.map((order) => (
                    <div
                        key={order.id}
                        className="border rounded-lg p-4"
                    >
                        <p>
                            <span className="font-semibold">
                                Orden:
                            </span>{" "}
                            {order.id}
                        </p>

                        <p>
                            <span className="font-semibold">
                                Total:
                            </span>{" "}
                            ${order.total}
                        </p>

                        <p>
                            <span className="font-semibold">
                                Estado:
                            </span>{" "}
                            {order.status}
                        </p>

                        <p>
                            <span className="font-semibold">
                                Fecha:
                            </span>{" "}
                            {new Date(
                                order.created_at
                            ).toLocaleDateString()}
                        </p>

                        <div className="mt-4 space-y-2">
                            {order.order_items.map((item: any, index: number) => (
                                <div
                                    key={index}
                                    className="border rounded p-2"
                                >
                                    <p className="font-semibold">
                                        {item.products?.name}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {item.variants?.option}
                                        {item.variants?.color &&
                                            ` | ${item.variants.color}`}
                                    </p>

                                    <p>
                                        Cantidad: {item.quantity}
                                    </p>

                                    <p>
                                        Precio unitario: ${item.price}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>                    
                ))}

                {orders?.length === 0 && (
                    <p>No tenés compras todavía.</p>
                )}
            </div>
        </div>
    );
}