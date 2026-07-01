import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/app/lib/adminApi";

const BUCKET = "product-images";
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
]);

const EXT_BY_TYPE: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
};

export async function POST(req: Request) {
    try {
        const auth = await requireAdmin();
        if ("error" in auth && auth.error) return auth.error;

        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json(
                {
                    error: "SUPABASE_SERVICE_ROLE_KEY no está configurada para subir imágenes",
                },
                { status: 500 }
            );
        }

        const formData = await req.formData();
        const file = formData.get("file");

        if (!file || !(file instanceof File)) {
            return NextResponse.json(
                { error: "No se recibió ninguna imagen" },
                { status: 400 }
            );
        }

        if (!ALLOWED_TYPES.has(file.type)) {
            return NextResponse.json(
                { error: "Formato no permitido. Usá JPG, PNG, WEBP o GIF" },
                { status: 400 }
            );
        }

        if (file.size > MAX_SIZE_BYTES) {
            return NextResponse.json(
                { error: "La imagen no puede superar 5 MB" },
                { status: 400 }
            );
        }

        const extension = EXT_BY_TYPE[file.type] || "jpg";
        const path = `products/${randomUUID()}.${extension}`;

        const buffer = Buffer.from(await file.arrayBuffer());

        const { error: uploadError } = await supabaseAdmin.storage
            .from(BUCKET)
            .upload(path, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            console.error("ERROR SUBIENDO IMAGEN:", uploadError);
            return NextResponse.json(
                { error: "No se pudo subir la imagen a Supabase Storage" },
                { status: 500 }
            );
        }

        const { data: publicData } = supabaseAdmin.storage
            .from(BUCKET)
            .getPublicUrl(path);

        return NextResponse.json({
            url: publicData.publicUrl,
            path,
        });
    } catch (error) {
        console.error("ERROR API UPLOAD:", error);
        return NextResponse.json(
            { error: "Error al subir la imagen" },
            { status: 500 }
        );
    }
}
