import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceRoleKey) {
    console.warn(
        "SUPABASE_SERVICE_ROLE_KEY no está configurada. Las operaciones admin pueden fallar por RLS."
    );
}

export const supabaseAdmin = createClient(
    supabaseUrl,
    supabaseServiceRoleKey ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);
