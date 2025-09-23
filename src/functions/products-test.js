import { supabase } from "../db/supabase-test.js";

export async function getProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('*');

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    return data;
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

export async function createProduct(name, description, price, stock, type, ingredients, allergens) {
    const { data, error } = await supabase
        .from('products')
        .insert({
            name,
            description,
            price,
            stock,
            type,
            ingredients,
            allergens
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