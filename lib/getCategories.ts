import { supabase } from "@/lib/supabase";

export async function getCategories() {
    const { data, error } = await supabase
        .from("categories")
        .select("*");

    if (error) {
        console.error(error);
        return [];
    }

    return data;
}