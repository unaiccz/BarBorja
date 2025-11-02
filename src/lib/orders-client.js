import { supabase } from '../db/supabase.js';

/**
 * Create a new order (client version)
 * @param {Object} orderData - Order data
 * @param {Array} orderItems - Array of order items
 * @returns {Promise<Object|null>} Created order object or null if error
 */
export async function createOrder(orderData, orderItems) {
    try {
        console.log('🛒 Creando pedido...', { orderData, orderItems });
        
        // Extract table number from orderData
        const tableNumber = orderData.table_number || null;

        // Start a transaction
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([{
                table_number: tableNumber,
                status: 'pending',
                total_amount: orderData.total_amount,
                estimated_time: orderData.estimated_time || 15 // tiempo estimado en minutos
            }])
            .select()
            .single();

        if (orderError) {
            console.error('❌ Error creating order:', orderError);
            return null;
        }

        console.log('✅ Orden creada:', order);

        // Insert order items
        const orderItemsWithOrderId = orderItems.map(item => ({
            order_id: order.order_id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.unit_price,
            note: item.note
        }));

        console.log('🍽️ Insertando items del pedido:', orderItemsWithOrderId);

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItemsWithOrderId);

        if (itemsError) {
            console.error('❌ Error creating order items:', itemsError);
            // Rollback order creation
            await supabase
                .from('orders')
                .delete()
                .eq('order_id', order.order_id);
            return null;
        }

        // Update product stock for each item
        for (const item of orderItems) {
            console.log(`📦 Actualizando stock del producto ${item.product_id}, cantidad: ${item.quantity}`);
            
            // First get current stock
            const { data: product, error: getError } = await supabase
                .from('products')
                .select('stock')
                .eq('product_id', item.product_id)
                .single();
            
            if (getError) {
                console.warn('⚠️ Warning: Could not get current stock for product', item.product_id, getError);
                continue;
            }
            
            // Calculate new stock (never below 0)
            const newStock = Math.max(0, (product.stock || 0) - item.quantity);
            
            // Update stock
            const { error: stockError } = await supabase
                .from('products')
                .update({ stock: newStock })
                .eq('product_id', item.product_id);
            
            if (stockError) {
                console.warn('⚠️ Warning: Could not update stock for product', item.product_id, stockError);
                // Don't fail the order creation if stock update fails
            } else {
                console.log(`✅ Stock actualizado para producto ${item.product_id}: ${product.stock} → ${newStock}`);
            }
        }

        console.log(`✅ Pedido creado exitosamente para Mesa ${tableNumber || 'N/A'} - ID: ${order.order_id} - Total: ${orderData.total_amount}€`);
        
        // Return the complete order
        return order;
    } catch (error) {
        console.error('💥 Error in createOrder:', error);
        return null;
    }
}

/**
 * Get orders by table number (client version)
 * @param {number} tableNumber - Table number
 * @returns {Promise<Array>} Array of orders for the specified table
 */
export async function getOrdersByTable(tableNumber) {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                order_id,
                table_number,
                status,
                estimated_time,
                total_amount,
                created_at,
                order_items (
                    *,
                    products (
                        name,
                        price,
                        type
                    )
                )
            `)
            .eq('table_number', tableNumber)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching orders by table:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error in getOrdersByTable:', error);
        return [];
    }
}

/**
 * Update order status (client version)
 * @param {number} orderId - Order ID
 * @param {string} status - New status ('pending', 'preparing', 'ready', 'completed', 'cancelled')
 * @returns {Promise<Object|null>} Updated order object or null if error
 */
export async function updateOrderStatus(orderId, status) {
    try {
        const { data, error } = await supabase
            .from('orders')
            .update({ 
                status: status
            })
            .eq('order_id', orderId)
            .select()
            .single();

        if (error) {
            console.error('Error updating order status:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error in updateOrderStatus:', error);
        return null;
    }
}