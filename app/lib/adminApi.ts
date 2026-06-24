import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

function getDbClient(hasServiceRole: boolean, userClient: Awaited<ReturnType<typeof createClient>>) {
    return hasServiceRole ? supabaseAdmin : userClient;
}

async function requireAdmin() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return {
            error: NextResponse.json({ error: "No autenticado" }, { status: 401 }),
        };
    }

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profileError || !profile) {
        return {
            error: NextResponse.json(
                { error: "No se pudo verificar el perfil" },
                { status: 403 }
            ),
        };
    }

    if (profile.role !== "admin") {
        return {
            error: NextResponse.json({ error: "No autorizado" }, { status: 403 }),
        };
    }

    const hasServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

    return {
        supabase,
        db: getDbClient(hasServiceRole, supabase),
    };
}

function rlsErrorResponse(resource: string) {
    return NextResponse.json(
        {
            error: `No se pudo guardar ${resource}. Configurá SUPABASE_SERVICE_ROLE_KEY en .env.local.`,
        },
        { status: 500 }
    );
}

export { requireAdmin, getDbClient, rlsErrorResponse };
