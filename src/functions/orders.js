import { supabase } from "../db/supabase.js";

// ========== FUNCIONES PARA ORDERS ==========

export async function getOrders() {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders:', error);
        return [];
    }

    return data;
}

export async function getOrderById(id) {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_id', id)
        .single();

    if (error) {
        console.error('Error fetching order by ID:', error);
        return null;
    }

    return data;
}

export async function createOrder(tableNumber, status, estimatedTime, totalAmount) {
    const { data, error } = await supabase
        .from('orders')
        .insert({
            table_number: tableNumber,
            status,
            estimated_time: estimatedTime,
            total_amount: totalAmount
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating order:', error);
        return null;
    }

    return data;
}

export async function updateOrder(id, updates) {
    const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('order_id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating order:', error);
        return null;
    }

    return data;
}

export async function deleteOrder(id) {
    const { data, error } = await supabase
        .from('orders')
        .delete()
        .eq('order_id', id)
        .select()
        .single();

    if (error) {
        console.error('Error deleting order:', error);
        return null;
    }

    return data;
}

export async function getOrdersByStatus(status) {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders by status:', error);
        return [];
    }

    return data;
}

export async function getOrdersByTable(tableNumber) {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('table_number', tableNumber)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders by table:', error);
        return [];
    }

    return data;
}

// ========== FUNCIONES PARA ORDER_ITEMS ==========

export async function getOrderItems(orderId) {
    const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

    if (error) {
        console.error('Error fetching order items:', error);
        return [];
    }

    return data;
}

export async function getOrderItemById(id) {
    const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_item_id', id)
        .single();

    if (error) {
        console.error('Error fetching order item by ID:', error);
        return null;
    }

    return data;
}

export async function createOrderItem(orderId, productId, quantity, price, note = null) {
    const { data, error } = await supabase
        .from('order_items')
        .insert({
            order_id: orderId,
            product_id: productId,
            quantity,
            price,
            note
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating order item:', error);
        return null;
    }

    return data;
}

export async function updateOrderItem(id, updates) {
    const { data, error } = await supabase
        .from('order_items')
        .update(updates)
        .eq('order_item_id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating order item:', error);
        return null;
    }

    return data;
}

export async function deleteOrderItem(id) {
    const { data, error } = await supabase
        .from('order_items')
        .delete()
        .eq('order_item_id', id)
        .select()
        .single();

    if (error) {
        console.error('Error deleting order item:', error);
        return null;
    }

    return data;
}

export async function deleteOrderItemsByOrderId(orderId) {
    const { data, error } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', orderId)
        .select();

    if (error) {
        console.error('Error deleting order items by order ID:', error);
        return null;
    }

    return data;
}

// ========== FUNCIONES COMBINADAS ==========

export async function getOrderWithItems(orderId) {
    try {
        const order = await getOrderById(orderId);
        if (!order) return null;

        const items = await getOrderItems(orderId);
        
        return {
            ...order,
            items
        };
    } catch (error) {
        console.error('Error fetching order with items:', error);
        return null;
    }
}

export async function createOrderWithItems(tableNumber, status, estimatedTime, orderItems) {
    try {
        // Calcular total
        const totalAmount = orderItems.reduce((sum, item) => 
            sum + (item.quantity * item.price), 0
        );

        // Crear orden
        const order = await createOrder(tableNumber, status, estimatedTime, totalAmount);
        if (!order) return null;

        // Crear items
        const items = [];
        for (const item of orderItems) {
            const orderItem = await createOrderItem(
                order.order_id,
                item.product_id,
                item.quantity,
                item.price,
                item.note
            );
            if (orderItem) items.push(orderItem);
        }

        return {
            ...order,
            items
        };
    } catch (error) {
        console.error('Error creating order with items:', error);
        return null;
    }
}