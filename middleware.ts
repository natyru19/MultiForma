import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MP_RETURN_PARAMS = [
    "external_reference",
    "payment_id",
    "collection_id",
    "status",
    "preference_id",
    "merchant_order_id",
] as const;

function isMercadoPagoReturn(searchParams: URLSearchParams) {
    return MP_RETURN_PARAMS.some((key) => {
        const value = searchParams.get(key);
        return value && value !== "null";
    });
}

export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname !== "/") {
        return NextResponse.next();
    }

    if (!isMercadoPagoReturn(request.nextUrl.searchParams)) {
        return NextResponse.next();
    }

    const successUrl = request.nextUrl.clone();
    successUrl.pathname = "/success";

    return NextResponse.redirect(successUrl);
}

export const config = {
    matcher: "/",
};
