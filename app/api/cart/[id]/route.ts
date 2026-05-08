import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {

    const { id } = await params;

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