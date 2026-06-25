"use client";

import { useCart } from "@/app/context/CartContext";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import BackLink from "@/components/BackLink";

export default function CheckoutPage() {

    const supabase = createClient();

    const { cart } = useCart();

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    const total = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });
    const [checkoutError, setCheckoutError] = useState("");
    const [paying, setPaying] = useState(false);

    useEffect(() => {

        const checkUser = async () => {

            const {
                data: { user },
            } = await supabase.auth.getUser();

            setUser(user);

            setLoading(false);
        };

        checkUser();

    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleCheckout = async () => {

        if (!user) return;

        if (!form.name.trim() || !form.email.trim()) {
            setCheckoutError("Completá nombre y email antes de pagar");
            return;
        }

        const cartId = localStorage.getItem("cart_id");

        setCheckoutError("");
        setPaying(true);

        try {

            const res = await fetch("/api/create-preference", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    items: cart.map((item) => ({
                        title: item.name,
                        quantity: item.quantity,
                        unit_price: item.price,
                    })),

                    cartId,
                    form,
                    userId: user.id,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setCheckoutError(data.error || "No se pudo iniciar el pago");
                return;
            }

            if (data.init_point) {

                window.location.href = data.init_point;

            } else {

                setCheckoutError("Error al conectar con Mercado Pago");
                console.error("Mercado Pago error:", data);
            }

        } catch (error) {

            console.error(error);
            setCheckoutError("Error al procesar el pago");
        } finally {
            setPaying(false);
        }
    };

    if (loading) {

        return <p className="p-6">Cargando...</p>;
    }

    if (!user) {

        return (

            <div className="p-6 max-w-2xl mx-auto text-center">

                <BackLink href="/cart" label="Volver al carrito" className="mb-6" />

                <h1 className="text-2xl font-bold mb-4">
                    Debes iniciar sesión para comprar
                </h1>

                <p className="text-gray-600 mb-6">
                    Inicia sesión o crea una cuenta para continuar con tu compra.
                </p>

                <div className="flex gap-4 justify-center">

                    <Link
                        href="/login?redirect=/checkout"
                        className="bg-black text-white px-6 py-3 rounded-lg"
                    >
                        Iniciar sesión
                    </Link>

                    <Link
                        href="/register?redirect=/checkout"
                        className="border px-6 py-3 rounded-lg"
                    >
                        Crear cuenta
                    </Link>

                </div>

            </div>
        );
    }

    return (

        <div className="p-6 max-w-4xl mx-auto">

            <BackLink href="/cart" label="Volver al carrito" className="mb-6" />

            <h1 className="text-2xl font-bold mb-6">
                Checkout
            </h1>

            <div className="space-y-4">

                {cart.map((item) => (

                    <div
                        key={item.cart_item_id}
                        className="border p-4 rounded"
                    >
                        <p className="font-semibold">
                            {item.name}
                        </p>

                        <p className="text-sm text-gray-500">
                            {item.option && `Option: ${item.option}`}
                            {item.color && ` | Color: ${item.color}`}
                        </p>

                        <p>
                            Cantidad: {item.quantity}
                        </p>

                        <p>
                            ${item.price * item.quantity}
                        </p>

                    </div>
                ))}
            </div>

            <div className="mt-8 space-y-4">

                <h2 className="text-xl font-bold">
                    Datos del cliente
                </h2>

                <input
                    name="name"
                    placeholder="Nombre"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                />

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                />

                <input
                    name="phone"
                    placeholder="Teléfono"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />

                <input
                    name="address"
                    placeholder="Dirección"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />

            </div>

            <div className="mt-6 text-xl font-bold">
                Total: ${total}
            </div>

            <button
                onClick={handleCheckout}
                disabled={paying || cart.length === 0}
                className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
            >
                {paying ? "Redirigiendo..." : "Pagar con MercadoPago"}
            </button>

            {checkoutError && (
                <div
                    role="alert"
                    className="mt-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
                >
                    {checkoutError}
                </div>
            )}

        </div>
    );
}