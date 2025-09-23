// Importar funciones a testear
import {
  // Orders functions
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrdersByStatus,
  getOrdersByTable,
  // Order items functions
  getOrderItems,
  getOrderItemById,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
  deleteOrderItemsByOrderId,
  // Combined functions
  getOrderWithItems,
  createOrderWithItems
} from './orders-test.js';

// Importar funciones de productos para crear productos de prueba
import {
  createProduct,
  deleteProduct
} from '../../src/functions/products-test.js';

async function runOrdersTests() {
    console.log('🧪 Iniciando tests de Orders y Order Items...\n');
    let passed = 0;
    let failed = 0;
    let testProduct = null;
    
    // Crear un producto de prueba primero
    try {
        console.log('🔧 Preparando: Creando producto de prueba...');
        testProduct = await createProduct(
            `Test Product for Orders ${Date.now()}`,
            'Producto para testear orders',
            15.50,
            10,
            'cocina',
            ['ingrediente1'],
            ['alérgeno1']
        );
        
        if (testProduct && testProduct.product_id) {
            console.log(`✅ Producto de prueba creado: ID ${testProduct.product_id}`);
        } else {
            console.log('❌ No se pudo crear producto de prueba. Algunos tests fallarán.');
        }
    } catch (error) {
        console.log('❌ Error creando producto de prueba:', error.message);
    }
    
    // Helper para crear datos de prueba
    const makeTestOrder = () => ({
        table_number: Math.floor(Math.random() * 20) + 1, // Mesa 1-20
        status: 'pendiente', // Usar status válido
        estimated_time: 25,
        total_amount: 29.99
    });
    
    const makeTestOrderItem = (orderId, productId) => ({
        order_id: orderId,
        product_id: productId,
        quantity: 2,
        price: 14.99,
        note: 'Sin cebolla'
    });
    
    // ========== TESTS DE ORDERS ==========
    
    // Test 1: Crear order
    try {
        console.log('🔄 Test 1: Crear order...');
        const orderData = makeTestOrder();
        const created = await createOrder(
            orderData.table_number,
            orderData.status,
            orderData.estimated_time,
            orderData.total_amount
        );
        
        if (created && created.order_id) {
            console.log('✅ Test 1 PASADO: Order creada exitosamente');
            console.log(`   ID: ${created.order_id}, Mesa: ${created.table_number}, Status: ${created.status}`);
            passed++;
            
            // Test 2: Obtener order por ID
            try {
                console.log('\n🔄 Test 2: Obtener order por ID...');
                const fetched = await getOrderById(created.order_id);
                
                if (fetched && fetched.order_id === created.order_id) {
                    console.log('✅ Test 2 PASADO: Order obtenida por ID');
                    passed++;
                } else {
                    console.log('❌ Test 2 FALLIDO: No se pudo obtener la order por ID');
                    failed++;
                }
            } catch (error) {
                console.log('❌ Test 2 FALLIDO:', error.message);
                failed++;
            }
            
            // Test 3: Actualizar order
            try {
                console.log('\n🔄 Test 3: Actualizar order...');
                const updated = await updateOrder(created.order_id, { 
                    status: 'preparando', // Usar un status que probablemente esté permitido
                    estimated_time: 20
                });
                
                if (updated && updated.estimated_time === 20) {
                    console.log('✅ Test 3 PASADO: Order actualizada exitosamente');
                    passed++;
                } else {
                    console.log('❌ Test 3 FALLIDO: No se pudo actualizar la order');
                    failed++;
                }
            } catch (error) {
                console.log('❌ Test 3 FALLIDO:', error.message);
                failed++;
            }
            
            // Test 4: Obtener orders por status
            try {
                console.log('\n🔄 Test 4: Obtener orders por status...');
                const ordersByStatus = await getOrdersByStatus('pendiente'); // Buscar por status válido
                
                if (Array.isArray(ordersByStatus)) {
                    console.log(`✅ Test 4 PASADO: Obtenidas ${ordersByStatus.length} orders por status`);
                    passed++;
                } else {
                    console.log('❌ Test 4 FALLIDO: No se pudieron obtener orders por status');
                    failed++;
                }
            } catch (error) {
                console.log('❌ Test 4 FALLIDO:', error.message);
                failed++;
            }
            
            // Test 5: Obtener orders por mesa
            try {
                console.log('\n🔄 Test 5: Obtener orders por mesa...');
                const ordersByTable = await getOrdersByTable(created.table_number);
                
                if (Array.isArray(ordersByTable) && ordersByTable.some(o => o.order_id === created.order_id)) {
                    console.log('✅ Test 5 PASADO: Orders obtenidas por mesa');
                    passed++;
                } else {
                    console.log('❌ Test 5 FALLIDO: No se encontró la order por mesa');
                    failed++;
                }
            } catch (error) {
                console.log('❌ Test 5 FALLIDO:', error.message);
                failed++;
            }
            
            // ========== TESTS DE ORDER ITEMS ==========
            
            // Test 6: Crear order item
            try {
                console.log('\n🔄 Test 6: Crear order item...');
                if (!testProduct) {
                    console.log('❌ Test 6 SALTADO: No hay producto de prueba disponible');
                    failed++;
                } else {
                    const itemData = makeTestOrderItem(created.order_id, testProduct.product_id);
                    const createdItem = await createOrderItem(
                        itemData.order_id,
                        itemData.product_id,
                        itemData.quantity,
                        itemData.price,
                        itemData.note
                    );
                
                    if (createdItem && createdItem.order_item_id) {
                        console.log('✅ Test 6 PASADO: Order item creado exitosamente');
                        console.log(`   ID: ${createdItem.order_item_id}, Cantidad: ${createdItem.quantity}, Precio: ${createdItem.price}`);
                        passed++;
                        
                        // Test 7: Obtener order item por ID
                        try {
                            console.log('\n🔄 Test 7: Obtener order item por ID...');
                            const fetchedItem = await getOrderItemById(createdItem.order_item_id);
                            
                            if (fetchedItem && fetchedItem.order_item_id === createdItem.order_item_id) {
                                console.log('✅ Test 7 PASADO: Order item obtenido por ID');
                                passed++;
                            } else {
                                console.log('❌ Test 7 FALLIDO: No se pudo obtener el order item por ID');
                                failed++;
                            }
                        } catch (error) {
                            console.log('❌ Test 7 FALLIDO:', error.message);
                            failed++;
                        }
                        
                        // Test 8: Obtener items de una order
                        try {
                            console.log('\n🔄 Test 8: Obtener items de una order...');
                            const orderItems = await getOrderItems(created.order_id);
                            
                            if (Array.isArray(orderItems) && orderItems.some(item => item.order_item_id === createdItem.order_item_id)) {
                                console.log(`✅ Test 8 PASADO: Obtenidos ${orderItems.length} items de la order`);
                                passed++;
                            } else {
                                console.log('❌ Test 8 FALLIDO: No se encontraron items de la order');
                                failed++;
                            }
                        } catch (error) {
                            console.log('❌ Test 8 FALLIDO:', error.message);
                            failed++;
                        }
                        
                        // Test 9: Actualizar order item
                        try {
                            console.log('\n🔄 Test 9: Actualizar order item...');
                            const updatedItem = await updateOrderItem(createdItem.order_item_id, { 
                                quantity: 3,
                                note: 'Con extra queso'
                            });
                            
                            if (updatedItem && updatedItem.quantity === 3) {
                                console.log('✅ Test 9 PASADO: Order item actualizado exitosamente');
                                passed++;
                            } else {
                                console.log('❌ Test 9 FALLIDO: No se pudo actualizar el order item');
                                failed++;
                            }
                        } catch (error) {
                            console.log('❌ Test 9 FALLIDO:', error.message);
                            failed++;
                        }
                        
                        // Test 10: Obtener order con items
                        try {
                            console.log('\n🔄 Test 10: Obtener order con items...');
                            const orderWithItems = await getOrderWithItems(created.order_id);
                            
                            if (orderWithItems && orderWithItems.items && orderWithItems.items.length > 0) {
                                console.log('✅ Test 10 PASADO: Order con items obtenida exitosamente');
                                console.log(`   Order ID: ${orderWithItems.order_id}, Items: ${orderWithItems.items.length}`);
                                passed++;
                            } else {
                                console.log('❌ Test 10 FALLIDO: No se pudo obtener order con items');
                                failed++;
                            }
                        } catch (error) {
                            console.log('❌ Test 10 FALLIDO:', error.message);
                            failed++;
                        }
                        
                        // Test 11: Eliminar order item
                        try {
                            console.log('\n🔄 Test 11: Eliminar order item...');
                            const deletedItem = await deleteOrderItem(createdItem.order_item_id);
                            
                            if (deletedItem) {
                                console.log('✅ Test 11 PASADO: Order item eliminado exitosamente');
                                passed++;
                            } else {
                                console.log('❌ Test 11 FALLIDO: No se pudo eliminar el order item');
                                failed++;
                            }
                        } catch (error) {
                            console.log('❌ Test 11 FALLIDO:', error.message);
                            failed++;
                        }
                        
                    } else {
                        console.log('❌ Test 6 FALLIDO: No se pudo crear el order item');
                        failed++;
                    }
                }
            } catch (error) {
                console.log('❌ Test 6 FALLIDO:', error.message);
                failed++;
            }
                
                if (createdItem && createdItem.order_item_id) {
                    console.log('✅ Test 6 PASADO: Order item creado exitosamente');
                    console.log(`   ID: ${createdItem.order_item_id}, Cantidad: ${createdItem.quantity}, Precio: ${createdItem.price}`);
                    passed++;
                    
                    // Test 7: Obtener order item por ID
                    try {
                        console.log('\n🔄 Test 7: Obtener order item por ID...');
                        const fetchedItem = await getOrderItemById(createdItem.order_item_id);
                        
                        if (fetchedItem && fetchedItem.order_item_id === createdItem.order_item_id) {
                            console.log('✅ Test 7 PASADO: Order item obtenido por ID');
                            passed++;
                        } else {
                            console.log('❌ Test 7 FALLIDO: No se pudo obtener el order item por ID');
                            failed++;
                        }
                    } catch (error) {
                        console.log('❌ Test 7 FALLIDO:', error.message);
                        failed++;
                    }
                    
                    // Test 8: Obtener items de una order
                    try {
                        console.log('\n🔄 Test 8: Obtener items de una order...');
                        const orderItems = await getOrderItems(created.order_id);
                        
                        if (Array.isArray(orderItems) && orderItems.some(item => item.order_item_id === createdItem.order_item_id)) {
                            console.log(`✅ Test 8 PASADO: Obtenidos ${orderItems.length} items de la order`);
                            passed++;
                        } else {
                            console.log('❌ Test 8 FALLIDO: No se encontraron items de la order');
                            failed++;
                        }
                    } catch (error) {
                        console.log('❌ Test 8 FALLIDO:', error.message);
                        failed++;
                    }
                    
                    // Test 9: Actualizar order item
                    try {
                        console.log('\n🔄 Test 9: Actualizar order item...');
                        const updatedItem = await updateOrderItem(createdItem.order_item_id, { 
                            quantity: 3,
                            note: 'Con extra queso'
                        });
                        
                        if (updatedItem && updatedItem.quantity === 3) {
                            console.log('✅ Test 9 PASADO: Order item actualizado exitosamente');
                            passed++;
                        } else {
                            console.log('❌ Test 9 FALLIDO: No se pudo actualizar el order item');
                            failed++;
                        }
                    } catch (error) {
                        console.log('❌ Test 9 FALLIDO:', error.message);
                        failed++;
                    }
                    
                    // Test 10: Obtener order con items
                    try {
                        console.log('\n🔄 Test 10: Obtener order con items...');
                        const orderWithItems = await getOrderWithItems(created.order_id);
                        
                        if (orderWithItems && orderWithItems.items && orderWithItems.items.length > 0) {
                            console.log('✅ Test 10 PASADO: Order con items obtenida exitosamente');
                            console.log(`   Order ID: ${orderWithItems.order_id}, Items: ${orderWithItems.items.length}`);
                            passed++;
                        } else {
                            console.log('❌ Test 10 FALLIDO: No se pudo obtener order con items');
                            failed++;
                        }
                    } catch (error) {
                        console.log('❌ Test 10 FALLIDO:', error.message);
                        failed++;
                    }
                    
                    // Test 11: Eliminar order item
                    try {
                        console.log('\n🔄 Test 11: Eliminar order item...');
                        const deletedItem = await deleteOrderItem(createdItem.order_item_id);
                        
                        if (deletedItem) {
                            console.log('✅ Test 11 PASADO: Order item eliminado exitosamente');
                            passed++;
                        } else {
                            console.log('❌ Test 11 FALLIDO: No se pudo eliminar el order item');
                            failed++;
                        }
                    } catch (error) {
                        console.log('❌ Test 11 FALLIDO:', error.message);
                        failed++;
                    }
                    
                } else {
                    console.log('❌ Test 6 FALLIDO: No se pudo crear el order item');
                    failed++;
                }
            } catch (error) {
                console.log('❌ Test 6 FALLIDO:', error.message);
                failed++;
            }
            
            // Test 12: Eliminar order
            try {
                console.log('\n🔄 Test 12: Eliminar order...');
                const deleted = await deleteOrder(created.order_id);
                
                if (deleted) {
                    console.log('✅ Test 12 PASADO: Order eliminada exitosamente');
                    passed++;
                } else {
                    console.log('❌ Test 12 FALLIDO: No se pudo eliminar la order');
                    failed++;
                }
            } catch (error) {
                console.log('❌ Test 12 FALLIDO:', error.message);
                failed++;
            }
            
        } else {
            console.log('❌ Test 1 FALLIDO: No se pudo crear la order');
            failed++;
        }
    } catch (error) {
        console.log('❌ Test 1 FALLIDO:', error.message);
        failed++;
    }
    
    // Test 13: Crear order con items (función combinada)
    try {
        console.log('\n🔄 Test 13: Crear order con items (función combinada)...');
        if (!testProduct) {
            console.log('❌ Test 13 SALTADO: No hay producto de prueba disponible');
            failed++;
        } else {
            const orderItems = [
                { product_id: testProduct.product_id, quantity: 2, price: 12.50, note: 'Sin tomate' },
                { product_id: testProduct.product_id, quantity: 1, price: 8.00, note: 'Extra queso' }
            ];
            
            const orderWithItems = await createOrderWithItems(5, 'pendiente', 30, orderItems);
            
            if (orderWithItems && orderWithItems.order_id && orderWithItems.items && orderWithItems.items.length === 2) {
                console.log('✅ Test 13 PASADO: Order con items creada exitosamente');
                console.log(`   Order ID: ${orderWithItems.order_id}, Items: ${orderWithItems.items.length}, Total: ${orderWithItems.total_amount}`);
                passed++;
                
                // Limpiar - eliminar la order creada
                await deleteOrderItemsByOrderId(orderWithItems.order_id);
                await deleteOrder(orderWithItems.order_id);
                
            } else {
                console.log('❌ Test 13 FALLIDO: No se pudo crear order con items');
                failed++;
            }
        }
    } catch (error) {
        console.log('❌ Test 13 FALLIDO:', error.message);
        failed++;
    }
    
    // Test 14: Obtener todas las orders
    try {
        console.log('\n🔄 Test 14: Obtener todas las orders...');
        const allOrders = await getOrders();
        
        if (Array.isArray(allOrders)) {
            console.log(`✅ Test 14 PASADO: Obtenidas ${allOrders.length} orders`);
            passed++;
        } else {
            console.log('❌ Test 14 FALLIDO: No se pudieron obtener las orders');
            failed++;
        }
    } catch (error) {
        console.log('❌ Test 14 FALLIDO:', error.message);
        failed++;
    }
    
    // Test 15: Obtener order inexistente
    try {
        console.log('\n🔄 Test 15: Obtener order inexistente...');
        const nonExistent = await getOrderById(-1);
        
        if (nonExistent === null) {
            console.log('✅ Test 15 PASADO: Retorna null para order inexistente');
            passed++;
        } else {
            console.log('❌ Test 15 FALLIDO: Debería retornar null');
            failed++;
        }
    } catch (error) {
        console.log('❌ Test 15 FALLIDO:', error.message);
        failed++;
    }
    
    // Limpiar producto de prueba
    if (testProduct && testProduct.product_id) {
        try {
            await deleteProduct(testProduct.product_id);
            console.log('\n🧹 Limpieza: Producto de prueba eliminado');
        } catch (error) {
            console.log('\n⚠️  No se pudo limpiar el producto de prueba');
        }
    }
    
    // Resumen
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE TESTS DE ORDERS:');
    console.log(`✅ Pasados: ${passed}`);
    console.log(`❌ Fallidos: ${failed}`);
    console.log(`📈 Total: ${passed + failed}`);
    
    if (failed === 0) {
        console.log('\n🎉 ¡Todos los tests de orders pasaron exitosamente!');
    } else {
        console.log('\n⚠️  Algunos tests fallaron. Revisa la configuración.');
    }
}

// Ejecutar tests
runOrdersTests().catch(error => {
    console.error('💥 Error ejecutando tests de orders:', error);
    process.exit(1);
});