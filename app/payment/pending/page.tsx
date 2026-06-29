import Link from "next/link";
import BackLink from "@/components/BackLink";
import ConfirmPendingPayment from "@/components/ConfirmPendingPayment";

export default function PaymentPendingPage() {
    return (
        <div className="p-6 max-w-2xl mx-auto text-center">
            <BackLink href="/cart" label="Volver al carrito" className="mb-6" />

            <h1 className="text-2xl font-bold mb-4">Pago en proceso</h1>

            <p className="text-gray-600 mb-8">
                Si completaste el pago en Mercado Pago, podés confirmar tu
                compra manualmente. También puede tardar unos segundos si el
                webhook aún no llegó.
            </p>

            <ConfirmPendingPayment className="text-left border rounded-lg p-5 bg-gray-50" />

            <Link
                href="/orders"
                className="inline-block mt-8 underline text-sm text-gray-500"
            >
                Ver mis compras
            </Link>
        </div>
    );
}
