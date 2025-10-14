import { supabase } from "../db/supabase.js";

export async function getProducts() {
    console.log('🔄 Iniciando getProducts...');
    console.log('🔗 Supabase URL:', import.meta.env?.SUPABASE_URL?.substring(0, 30) + '...' || 'No configurada');

    try {
        const { data, error } = await supabase
            .from('products')
            .select('*');

        if (error) {
            console.error('❌ Error fetching products:', error);
            console.error('Error details:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            return [];
        }

        console.log('✅ Products fetched successfully:', data?.length || 0, 'items');
        return data;
    } catch (err) {
        console.error('❌ Unexpected error in getProducts:', err);
        return [];
    }
}
export async function getProductById(id) {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('product_id', id)
        .single();

    if (error) {
        console.error('Error fetching product by ID:', error);
        return null;
    }

    return data;
}
export async function createProduct(name, description, price, stock, type, ingredients, allergens, image_url) {
    const { data, error } = await supabase
        .from('products')
        .insert({
            name,
            description,
            price,
            stock,
            type,
            ingredients,
            allergens,
            image_url
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating product:', error);
        return null;
    }

    return data;
}
export async function updateProduct(id, updates) {
    const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('product_id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating product:', error);
        return null;
    }

    return data;
}
export async function deleteProduct(id) {
    const { data, error } = await supabase
        .from('products')
        .delete()
        .eq('product_id', id)
        .select()
        .single();

    if (error) {
        console.error('Error deleting product:', error);
        return null;
    }

    return data;
}
