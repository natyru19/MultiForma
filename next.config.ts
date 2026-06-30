import type { NextConfig } from "next";

function getNgrokDevOrigins(): string[] {
    const ngrokUrl = process.env.NGROK_URL?.trim();

    if (!ngrokUrl) return [];

    try {
        return [new URL(ngrokUrl).hostname];
    } catch {
        return [];
    }
}

const nextConfig: NextConfig = {
    allowedDevOrigins: getNgrokDevOrigins(),
};

export default nextConfig;
