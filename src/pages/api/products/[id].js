import { updateProduct as updateProductDB, deleteProduct as deleteProductDB } from '../../functions/products.js';

export const PUT = async ({ request, params }) => {
    try {
        const productId = params?.id;
        if (!productId) {
            return new Response(JSON.stringify({ error: 'Product ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const updates = await request.json();
        const updatedProduct = await updateProductDB(parseInt(productId), updates);

        if (updatedProduct) {
            return new Response(JSON.stringify(updatedProduct), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            return new Response(JSON.stringify({ error: 'Error updating product' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        console.error('Error updating product:', error);
        return new Response(JSON.stringify({ error: 'Error updating product' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

export const DELETE = async ({ params }) => {
    try {
        const productId = params?.id;
        if (!productId) {
            return new Response(JSON.stringify({ error: 'Product ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const success = await deleteProductDB(parseInt(productId));

        if (success) {
            return new Response(null, { status: 204 });
        } else {
            return new Response(JSON.stringify({ error: 'Error deleting product' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        return new Response(JSON.stringify({ error: 'Error deleting product' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
