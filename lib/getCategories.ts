import { createClient } from "@/lib/supabase/server";

export async function getCategories() {

    const supabase = await createClient();
    
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("active", true);

    if (error) {
        console.error(error);
        return [];
    }

    return data;
}