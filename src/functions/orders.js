import { supabase } from '../db/supabase.js';

/**
 * Get all orders from the database
 * @returns {Promise<Array>} Array of order objects or empty array if error
 */
export async function getOrders() {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    *,
                    products (
                        name,
                        price,
                        type
                    )
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching orders:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error in getOrders:', error);
        return [];
    }
}

/**
 * Get orders by type (cocina or barra)
 * @param {string} type - Order type ('cocina' or 'barra')
 * @returns {Promise<Array>} Array of filtered order objects
 */
export async function getOrdersByType(type) {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    *,
                    products (
                        name,
                        price,
                        type
                    )
                )
            `)
            .eq('type', type)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching orders by type:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error in getOrdersByType:', error);
        return [];
    }
}

/**
 * Get orders by status
 * @param {string} status - Order status ('pending', 'preparing', 'ready', 'completed')
 * @returns {Promise<Array>} Array of filtered order objects
 */
export async function getOrdersByStatus(status) {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    *,
                    products (
                        name,
                        price,
                        type
                    )
                )
            `)
            .eq('status', status)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching orders by status:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error in getOrdersByStatus:', error);
        return [];
    }
}

/**
 * Get orders by type and status
 * @param {string} type - Order type ('cocina' or 'barra')
 * @param {string} status - Order status ('pending', 'preparing', 'ready', 'completed')
 * @returns {Promise<Array>} Array of filtered order objects
 */
export async function getOrdersByTypeAndStatus(type, status) {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    *,
                    products (
                        name,
                        price,
                        type
                    )
                )
            `)
            .eq('type', type)
            .eq('status', status)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching orders by type and status:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error in getOrdersByTypeAndStatus:', error);
        return [];
    }
}

/**
 * Get a single order by ID
 * @param {number} orderId - Order ID
 * @returns {Promise<Object|null>} Order object or null if not found/error
 */
export async function getOrderById(orderId) {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    *,
                    products (
                        name,
                        price,
                        type
                    )
                )
            `)
            .eq('order_id', orderId)
            .single();

        if (error) {
            console.error('Error fetching order by ID:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error in getOrderById:', error);
        return null;
    }
}

/**
 * Create a new order
 * @param {Object} orderData - Order data
 * @param {Array} orderItems - Array of order items
 * @returns {Promise<Object|null>} Created order object or null if error
 */
export async function createOrder(orderData, orderItems) {
    try {
        // Start a transaction
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([{
                customer_name: orderData.customer_name,
                customer_phone: orderData.customer_phone,
                customer_address: orderData.customer_address,
                order_type: orderData.order_type, // 'dine_in', 'takeaway', 'delivery'
                status: 'pending',
                total_amount: orderData.total_amount,
                notes: orderData.notes,
                type: orderData.type // 'cocina', 'barra', or 'mixed'
            }])
            .select()
            .single();

        if (orderError) {
            console.error('Error creating order:', orderError);
            return null;
        }

        // Insert order items
        const orderItemsWithOrderId = orderItems.map(item => ({
            order_id: order.order_id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            subtotal: item.quantity * item.unit_price,
            notes: item.notes
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItemsWithOrderId);

        if (itemsError) {
            console.error('Error creating order items:', itemsError);
            // Rollback order creation
            await supabase
                .from('orders')
                .delete()
                .eq('order_id', order.order_id);
            return null;
        }

        // Return the complete order with items
        return await getOrderById(order.order_id);
    } catch (error) {
        console.error('Error in createOrder:', error);
        return null;
    }
}

/**
 * Update order status
 * @param {number} orderId - Order ID
 * @param {string} status - New status ('pending', 'preparing', 'ready', 'completed', 'cancelled')
 * @returns {Promise<Object|null>} Updated order object or null if error
 */
export async function updateOrderStatus(orderId, status) {
    try {
        const { data, error } = await supabase
            .from('orders')
            .update({ 
                status: status,
                updated_at: new Date().toISOString()
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

/**
 * Update order information
 * @param {number} orderId - Order ID
 * @param {Object} updates - Object with fields to update
 * @returns {Promise<Object|null>} Updated order object or null if error
 */
export async function updateOrder(orderId, updates) {
    try {
        const { data, error } = await supabase
            .from('orders')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('order_id', orderId)
            .select()
            .single();

        if (error) {
            console.error('Error updating order:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error in updateOrder:', error);
        return null;
    }
}

/**
 * Delete an order and its items
 * @param {number} orderId - Order ID
 * @returns {Promise<boolean>} True if successful, false if error
 */
export async function deleteOrder(orderId) {
    try {
        // First delete order items
        const { error: itemsError } = await supabase
            .from('order_items')
            .delete()
            .eq('order_id', orderId);

        if (itemsError) {
            console.error('Error deleting order items:', itemsError);
            return false;
        }

        // Then delete the order
        const { error: orderError } = await supabase
            .from('orders')
            .delete()
            .eq('order_id', orderId);

        if (orderError) {
            console.error('Error deleting order:', orderError);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in deleteOrder:', error);
        return false;
    }
}

/**
 * Get order statistics
 * @param {string} period - Period for stats ('today', 'week', 'month')
 * @returns {Promise<Object>} Statistics object
 */
export async function getOrderStats(period = 'today') {
    try {
        let dateFilter;
        const now = new Date();
        
        switch (period) {
            case 'today':
                dateFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
                break;
            case 'week':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                dateFilter = weekAgo.toISOString();
                break;
            case 'month':
                const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                dateFilter = monthAgo.toISOString();
                break;
            default:
                dateFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        }

        const { data, error } = await supabase
            .from('orders')
            .select('order_id, status, total_amount, type, created_at')
            .gte('created_at', dateFilter);

        if (error) {
            console.error('Error fetching order stats:', error);
            return {
                total_orders: 0,
                total_revenue: 0,
                orders_by_status: {},
                orders_by_type: {}
            };
        }

        const stats = {
            total_orders: data.length,
            total_revenue: data.reduce((sum, order) => sum + (order.total_amount || 0), 0),
            orders_by_status: {},
            orders_by_type: {}
        };

        // Count by status
        data.forEach(order => {
            stats.orders_by_status[order.status] = (stats.orders_by_status[order.status] || 0) + 1;
            stats.orders_by_type[order.type] = (stats.orders_by_type[order.type] || 0) + 1;
        });

        return stats;
    } catch (error) {
        console.error('Error in getOrderStats:', error);
        return {
            total_orders: 0,
            total_revenue: 0,
            orders_by_status: {},
            orders_by_type: {}
        };
    }
}

/**
 * Get pending orders count by type
 * @returns {Promise<Object>} Object with pending counts by type
 */
export async function getPendingOrdersCounts() {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('type')
            .in('status', ['pending', 'preparing']);

        if (error) {
            console.error('Error fetching pending orders count:', error);
            return { cocina: 0, barra: 0 };
        }

        const counts = { cocina: 0, barra: 0 };
        data.forEach(order => {
            if (order.type === 'cocina' || order.type === 'mixed') {
                counts.cocina++;
            }
            if (order.type === 'barra' || order.type === 'mixed') {
                counts.barra++;
            }
        });

        return counts;
    } catch (error) {
        console.error('Error in getPendingOrdersCounts:', error);
        return { cocina: 0, barra: 0 };
    }
}