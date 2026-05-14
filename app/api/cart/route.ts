import { NextResponse } from 'next/server';
import { cartService } from '@/app/services/cart.service';

export async function GET() {
    return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        let { product_id, variant_id, cart_id, quantity, price } = body;

        if(!product_id) {
            return NextResponse.json({ error: 'El dato es requerido' }, { status: 400 });
        }

        if (!variant_id) {
            return NextResponse.json({ error: "Debe seleccionar una variante" }, { status: 400 });
        }   

        quantity = quantity || 1;
        price = price || 0;
        const result = await cartService.addToCart({product_id, variant_id, cart_id, quantity, price});

        return NextResponse.json({ message: 'Success', data: result }, { status: 200 });
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { cart_item_id, quantity } = body;

        if (!cart_item_id) {
            return Response.json({ error: "cart_item_id requerido" }, { status: 400 });
        }

        if (quantity < 1) {
            return Response.json({ error: "Cantidad inválida" }, { status: 400 });
        }

        await cartService.updateQuantity(cart_item_id, quantity);

        return Response.json({ message: "Cantidad actualizada" });
    } catch (error) {
        console.error('Error al modificar el carrito:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });        
    }
}

export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const { cart_item_id } = body;

        if (!cart_item_id) {
            return Response.json({ error: "cart_item_id requerido" }, { status: 400 });
        }

        await cartService.removeItem(cart_item_id);

        return Response.json({ message: "Item eliminado" });

    } catch (error) {
        console.error(error);
        return Response.json({ error: "Error interno" }, { status: 500 });
    }
}