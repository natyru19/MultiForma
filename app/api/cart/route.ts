import { NextResponse } from 'next/server';
import { cartService } from '@/app/services/cart.service';

export async function GET() {
    return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        let { product_id, variant_id, cart_id, quantity } = body;

        if(!product_id) {
            return NextResponse.json({ error: 'El dato es requerido' }, { status: 400 });
        }

        if (!variant_id) {
            return NextResponse.json({ error: "Debe seleccionar una variante" }, { status: 400 });
        }   

        quantity = quantity || 1;

        const result = await cartService.addToCart({product_id, variant_id, cart_id, quantity});

        return NextResponse.json({ message: 'Success', data: result }, { status: 200 });
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}