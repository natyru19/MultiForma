const DEFAULT_VERCEL_APP_URL = "https://multiforma-ecommerce.vercel.app";

function normalizeUrl(url: string) {
    return url.trim().replace(/\/$/, "");
}

export function getVercelAppUrl() {
    return normalizeUrl(
        process.env.NEXT_PUBLIC_VERCEL_APP_URL || DEFAULT_VERCEL_APP_URL
    );
}

export function getAppUrl() {
    if (process.env.NEXT_PUBLIC_APP_URL) {
        return normalizeUrl(process.env.NEXT_PUBLIC_APP_URL);
    }

    return getVercelAppUrl();
}

export function isLocalDevelopment(appUrl = getAppUrl()) {
    return (
        appUrl.includes("localhost") ||
        appUrl.includes("127.0.0.1")
    );
}

export type MercadoPagoUrlConfig = {
    mode: "local" | "production";
    baseUrl: string;
    notification_url: string;
    back_urls: {
        success: string;
        failure: string;
        pending: string;
    };
};

export function getMercadoPagoUrls(): MercadoPagoUrlConfig {
    const appUrl = getAppUrl();
    const vercelUrl = getVercelAppUrl();
    const ngrokUrl = process.env.NGROK_URL
        ? normalizeUrl(process.env.NGROK_URL)
        : null;

    if (isLocalDevelopment(appUrl)) {
        if (!ngrokUrl) {
            throw new Error(
                "NGROK_URL no está configurada. Para probar pagos en local, ejecutá ngrok http 3000 y agregá la URL en .env.local."
            );
        }

        return {
            mode: "local",
            baseUrl: ngrokUrl,
            notification_url: `${ngrokUrl}/api/webhooks/mercadopago`,
            back_urls: {
                success: `${ngrokUrl}/success`,
                failure: ngrokUrl,
                pending: ngrokUrl,
            },
        };
    }

    const productionBase =
        appUrl && !isLocalDevelopment(appUrl) ? appUrl : vercelUrl;

    return {
        mode: "production",
        baseUrl: productionBase,
        notification_url: `${productionBase}/api/webhooks/mercadopago`,
        back_urls: {
            success: `${productionBase}/success`,
            failure: productionBase,
            pending: productionBase,
        },
    };
}
