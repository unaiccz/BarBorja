import { getProducts, createProduct as createProductDB, updateProduct as updateProductDB, deleteProduct as deleteProductDB } from '../../functions/products.js';

export const prerender = false;

export const GET = async ({ request }) => {
    try {
        const products = await getProducts();
        return new Response(JSON.stringify(products), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return new Response(JSON.stringify({ error: 'Error fetching products' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
};

export const POST = async ({ request }) => {
    try {
        const productData = await request.json();
        const { name, description, price, stock, type, ingredients, allergens } = productData;
        
        const newProduct = await createProductDB(name, description, price, stock, type, ingredients, allergens);
        
        if (newProduct) {
            return new Response(JSON.stringify(newProduct), {
                status: 201,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } else {
            return new Response(JSON.stringify({ error: 'Error creating product' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    } catch (error) {
        console.error('Error creating product:', error);
        return new Response(JSON.stringify({ error: 'Error creating product' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
};