"use client";

import { useCart } from "@/app/context/CartContext";
import { useState } from "react";

export default function CheckoutPage() {

    const { cart } = useCart();

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleCheckout = async () => {
        const cartId = localStorage.getItem("cart_id");

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
                }),
            });

            const data = await res.json();

            window.location.href = data.init_point;

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>

            <div className="space-y-4">
                {cart.map((item) => (
                <div key={item.cart_item_id} className="border p-4 rounded">
                    <p className="font-semibold">{item.name}</p>

                    <p className="text-sm text-gray-500">
                        {item.option && `Option: ${item.option}`}
                        {item.color && ` | Color: ${item.color}`}
                    </p>

                    <p>Cantidad: {item.quantity}</p>
                    <p>${item.price * item.quantity}</p>
                </div>
                ))}
            </div>

            <div className="mt-8 space-y-4">
                <h2 className="text-xl font-bold">Datos del cliente</h2>

                <input
                    name="name"
                    placeholder="Nombre"
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />

                <input
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />

                <input
                    name="phone"
                    placeholder="Teléfono"
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />

                <input
                    name="address"
                    placeholder="Dirección"
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
            </div>

            <div className="mt-6 text-xl font-bold">
                Total: ${total}
            </div>

            <button
                onClick={handleCheckout}
                className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg"
            >
                Pagar con MercadoPago
            </button>
        </div>
    );
}