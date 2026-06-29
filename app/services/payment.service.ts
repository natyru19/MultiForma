import { supabaseAdmin } from "@/lib/supabase/admin";
import { orderService } from "@/app/services/order.service";

type CustomerForm = {
    name: string;
    email: string;
    phone: string;
    address: string;
};

type ProcessPaymentResult =
    | { ok: true; orderId?: string; message: string; pending?: boolean }
    | { ok: false; message: string; status?: number };

function parseCustomerFromPayment(payment: Record<string, unknown>): CustomerForm | null {
    const metadata = (payment.metadata ?? {}) as Record<string, string>;

    const customer: CustomerForm = {
        name: metadata.customer_name || "",
        email: metadata.customer_email || "",
        phone: metadata.customer_phone || "",
        address: metadata.customer_address || "",
    };

    if (metadata.customer) {
        try {
            const parsed = JSON.parse(metadata.customer) as CustomerForm;
            return {
                name: parsed.name || customer.name,
                email: parsed.email || customer.email,
                phone: parsed.phone || customer.phone,
                address: parsed.address || customer.address,
            };
        } catch {
            // MP metadata antiguo o inválido
        }
    }

    if (!customer.name && !customer.email) {
        const payer = payment.payer as
            | {
                  email?: string;
                  first_name?: string;
                  last_name?: string;
              }
            | undefined;

        customer.name =
            [payer?.first_name, payer?.last_name].filter(Boolean).join(" ") ||
            "Cliente";
        customer.email = payer?.email || "";
    }

    if (!customer.email) {
        return null;
    }

    return customer;
}

function getCartIdFromPayment(payment: Record<string, unknown>): string | null {
    const metadata = (payment.metadata ?? {}) as Record<string, string>;

    return (
        metadata.cart_id ||
        (payment.external_reference as string | undefined) ||
        null
    );
}

export async function fetchMercadoPagoPayment(paymentId: string) {
    const response = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
            },
            cache: "no-store",
        }
    );

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("ERROR MP PAYMENT FETCH:", paymentId, errorBody);
        return null;
    }

    return response.json();
}

export async function processApprovedPayment(
    paymentId: string
): Promise<ProcessPaymentResult> {
    const payment = await fetchMercadoPagoPayment(paymentId);

    if (!payment) {
        return {
            ok: false,
            message: "No se pudo obtener el pago de Mercado Pago",
            status: 502,
        };
    }

    console.log("PROCESS PAYMENT:", paymentId, payment.status, payment.metadata);

    if (payment.status !== "approved") {
        const pendingStatuses = ["pending", "in_process", "in_mediation", "authorized"];
        if (pendingStatuses.includes(payment.status)) {
            return {
                ok: true,
                pending: true,
                message: `Pago en estado ${payment.status}; se procesará al aprobarse`,
            };
        }

        return {
            ok: false,
            message: `Pago no aprobado (${payment.status})`,
            status: 400,
        };
    }

    const cartId = getCartIdFromPayment(payment);
    const customer = parseCustomerFromPayment(payment);
    const userId = (payment.metadata as Record<string, string> | undefined)?.user_id;

    if (!cartId) {
        return {
            ok: false,
            message: "No se encontró el carrito asociado al pago",
            status: 400,
        };
    }

    if (!customer) {
        return {
            ok: false,
            message: "Faltan datos del cliente en el pago",
            status: 400,
        };
    }

    const { data: existingOrder } = await supabaseAdmin
        .from("orders")
        .select("id")
        .eq("payment_id", String(paymentId))
        .maybeSingle();

    if (existingOrder) {
        return {
            ok: true,
            orderId: existingOrder.id,
            message: "Orden ya procesada",
        };
    }

    const { data: cartItems, error: cartError } = await supabaseAdmin
        .from("cart_items")
        .select("*")
        .eq("cart_id", cartId);

    if (cartError) {
        console.error("ERROR OBTENIENDO CART ITEMS:", cartError);
        return {
            ok: false,
            message: "Error al leer el carrito",
            status: 500,
        };
    }

    if (!cartItems?.length) {
        return {
            ok: false,
            message: "El carrito ya fue procesado o está vacío",
            status: 400,
        };
    }

    try {
        const order = await orderService.createOrder({
            cart: cartItems,
            form: customer,
            userId,
            paymentId,
        });

        await supabaseAdmin
            .from("cart_items")
            .delete()
            .eq("cart_id", cartId);

        await supabaseAdmin.from("carts").delete().eq("id", cartId);

        return {
            ok: true,
            orderId: order!.id,
            message: "Orden creada correctamente",
        };
    } catch (error) {
        console.error("ERROR CREANDO ORDEN:", error);
        return {
            ok: false,
            message: "Error al guardar la orden en la base de datos",
            status: 500,
        };
    }
}

export function extractPaymentIdFromWebhook(
    req: Request,
    body: Record<string, unknown>
): string | null {
    const { searchParams } = new URL(req.url);

    const fromQuery =
        searchParams.get("data.id") ||
        searchParams.get("id") ||
        null;

    const fromBody =
        (body?.data as { id?: string } | undefined)?.id ||
        (body?.resource as string | undefined) ||
        null;

    if (!fromQuery && !fromBody) return null;

    const raw = fromQuery || fromBody || "";

    if (typeof raw === "string" && raw.includes("/")) {
        const parts = raw.split("/");
        return parts[parts.length - 1] || null;
    }

    return String(raw);
}

export async function processMerchantOrder(
    merchantOrderId: string
): Promise<ProcessPaymentResult> {
    const response = await fetch(
        `https://api.mercadopago.com/merchant_orders/${merchantOrderId}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
            },
            cache: "no-store",
        }
    );

    if (!response.ok) {
        console.error("ERROR MP MERCHANT ORDER:", merchantOrderId, await response.text());
        return {
            ok: false,
            message: "No se pudo obtener la orden de Mercado Pago",
            status: 502,
        };
    }

    const merchantOrder = await response.json();
    const payments = (merchantOrder.payments ?? []) as Array<{
        id: number | string;
        status: string;
    }>;

    const approvedPayment = payments.find((p) => p.status === "approved");

    if (!approvedPayment) {
        return {
            ok: true,
            pending: true,
            message: "Pago pendiente; se procesará cuando Mercado Pago lo apruebe",
        };
    }

    return processApprovedPayment(String(approvedPayment.id));
}

export async function confirmPendingByCartId(
    cartId: string
): Promise<ProcessPaymentResult> {
    const response = await fetch(
        `https://api.mercadopago.com/v1/payments/search?external_reference=${encodeURIComponent(cartId)}&sort=date_created&criteria=desc`,
        {
            headers: {
                Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
            },
            cache: "no-store",
        }
    );

    if (!response.ok) {
        console.error("ERROR MP PAYMENT SEARCH:", await response.text());
        return {
            ok: false,
            message: "No se pudo buscar el pago en Mercado Pago",
            status: 502,
        };
    }

    const searchData = await response.json();
    const results = (searchData.results ?? []) as Array<{
        id: number | string;
        status: string;
    }>;

    const approvedPayment = results.find((p) => p.status === "approved");

    if (!approvedPayment) {
        return {
            ok: false,
            message:
                "No encontramos un pago aprobado para este carrito. Si acabás de pagar, esperá unos segundos e intentá de nuevo.",
            status: 404,
        };
    }

    return processApprovedPayment(String(approvedPayment.id));
}
