import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
    
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {

    const { id } = await params;

    const supabase = await createClient();

    const { error } = await supabase
        .from("carts")
        .delete()
        .eq("id", id);

    if (error) {
        return NextResponse.json(error, { status: 500 });
    }

    return NextResponse.json({
        message: "Cart deleted",
    });
}