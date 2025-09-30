import { 
    getOrders, 
    getOrdersByType, 
    getOrdersByStatus, 
    getOrdersByTypeAndStatus,
    createOrder,
    updateOrderStatus
} from '../../functions/orders.js';

export const prerender = false;

export const GET = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const type = url.searchParams.get('type');
        const status = url.searchParams.get('status');

        let orders;

        if (type && status) {
            orders = await getOrdersByTypeAndStatus(type, status);
        } else if (type) {
            orders = await getOrdersByType(type);
        } else if (status) {
            orders = await getOrdersByStatus(status);
        } else {
            orders = await getOrders();
        }

        return new Response(JSON.stringify(orders), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return new Response(JSON.stringify({ error: 'Error fetching orders' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
};

export const POST = async ({ request }) => {
    try {
        const requestData = await request.json();
        const { orderData, orderItems } = requestData;
        
        if (!orderData || !orderItems || !Array.isArray(orderItems)) {
            return new Response(JSON.stringify({ error: 'Invalid order data' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
        
        const newOrder = await createOrder(orderData, orderItems);
        
        if (newOrder) {
            return new Response(JSON.stringify(newOrder), {
                status: 201,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } else {
            return new Response(JSON.stringify({ error: 'Error creating order' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    } catch (error) {
        console.error('Error creating order:', error);
        return new Response(JSON.stringify({ error: 'Error creating order' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
};

export const PUT = async ({ request }) => {
    try {
        const { orderId, status } = await request.json();
        
        if (!orderId || !status) {
            return new Response(JSON.stringify({ error: 'Order ID and status are required' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
        
        const updatedOrder = await updateOrderStatus(orderId, status);
        
        if (updatedOrder) {
            return new Response(JSON.stringify(updatedOrder), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } else {
            return new Response(JSON.stringify({ error: 'Error updating order status' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        return new Response(JSON.stringify({ error: 'Error updating order status' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
};