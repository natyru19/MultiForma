export const cartService = {
    async addToCart({
        product_id,
        cart_id,
        quantity,
    }: {
        product_id: number;
        cart_id?: number;
        quantity: number;
    }) {
        console.log(
        `Agregando producto ${product_id}, carrito ${cart_id} con cantidad ${quantity}`
        );

        return {
        success: true,
        message: 'Producto agregado al carrito',
        };
    },
};