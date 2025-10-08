import { createOrder } from '../../functions/orders.js';

export async function post({ request }) {
  try {
    const { table_number, items, total_amount, order_type } = await request.json();

    console.log('📦 API: Creando pedido con stock management...', { table_number, items, total_amount });

    // Prepare order data
    const orderData = {
      table_number,
      total_amount,
      estimated_time: 15
    };

    // Prepare order items data
    const orderItems = items.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      note: item.note || null
    }));

    // Create order using the function that handles stock updates
    const order = await createOrder(orderData, orderItems);

    if (!order) {
      console.error('❌ API: createOrder returned null');
      return new Response(JSON.stringify({ error: 'Failed to create order' }), { status: 500 });
    }

    console.log('✅ API: Pedido creado con stock actualizado - ID:', order.order_id);
    return new Response(JSON.stringify({ order }), { status: 201 });
  } catch (error) {
    console.error('💥 API: Error al crear pedido:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
