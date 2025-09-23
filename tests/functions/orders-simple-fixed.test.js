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
    
    // Test 1: Crear order
    try {
        console.log('\n🔄 Test 1: Crear order...');
        const created = await createOrder(5, 'pendiente', 25, 29.99);
        
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
                    status: 'preparando', // Usar un status válido
                    estimated_time: 20
                });
                
                if (updated && updated.status === 'preparando' && updated.estimated_time === 20) {
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
                const ordersByStatus = await getOrdersByStatus('preparando'); // Buscar por el status actualizado
                
                if (Array.isArray(ordersByStatus) && ordersByStatus.some(o => o.order_id === created.order_id)) {
                    console.log(`✅ Test 4 PASADO: Obtenidas ${ordersByStatus.length} orders por status 'preparando'`);
                    passed++;
                } else {
                    console.log('❌ Test 4 FALLIDO: No se encontró la order por status');
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
            
            // Test 6: Crear order item (solo si tenemos producto de prueba)
            if (testProduct && testProduct.product_id) {
                try {
                    console.log('\n🔄 Test 6: Crear order item...');
                    const createdItem = await createOrderItem(
                        created.order_id,
                        testProduct.product_id,
                        2,
                        14.99,
                        'Sin cebolla'
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
                        
                        // Test 8: Eliminar order item
                        try {
                            console.log('\n🔄 Test 8: Eliminar order item...');
                            const deletedItem = await deleteOrderItem(createdItem.order_item_id);
                            
                            if (deletedItem) {
                                console.log('✅ Test 8 PASADO: Order item eliminado exitosamente');
                                passed++;
                            } else {
                                console.log('❌ Test 8 FALLIDO: No se pudo eliminar el order item');
                                failed++;
                            }
                        } catch (error) {
                            console.log('❌ Test 8 FALLIDO:', error.message);
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
            } else {
                console.log('\n❌ Tests 6-8 SALTADOS: No hay producto de prueba disponible');
                failed += 3;
            }
            
            // Test 9: Eliminar order
            try {
                console.log('\n🔄 Test 9: Eliminar order...');
                const deleted = await deleteOrder(created.order_id);
                
                if (deleted) {
                    console.log('✅ Test 9 PASADO: Order eliminada exitosamente');
                    passed++;
                } else {
                    console.log('❌ Test 9 FALLIDO: No se pudo eliminar la order');
                    failed++;
                }
            } catch (error) {
                console.log('❌ Test 9 FALLIDO:', error.message);
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
    
    // Test 10: Probar diferentes status válidos
    try {
        console.log('\n🔄 Test 10: Probar diferentes status válidos...');
        const statusList = ['pendiente', 'preparando', 'listo', 'entregado', 'cancelado'];
        let statusTestsPassed = 0;
        
        for (const status of statusList) {
            const order = await createOrder(10, status, 15, 25.00);
            if (order && order.status === status) {
                statusTestsPassed++;
                await deleteOrder(order.order_id); // Limpiar
            }
        }
        
        if (statusTestsPassed === statusList.length) {
            console.log(`✅ Test 10 PASADO: Todos los ${statusList.length} status válidos funcionan`);
            passed++;
        } else {
            console.log(`❌ Test 10 FALLIDO: Solo ${statusTestsPassed}/${statusList.length} status funcionan`);
            failed++;
        }
    } catch (error) {
        console.log('❌ Test 10 FALLIDO:', error.message);
        failed++;
    }
    
    // Test 11: Obtener todas las orders
    try {
        console.log('\n🔄 Test 10: Obtener todas las orders...');
        const allOrders = await getOrders();
        
        if (Array.isArray(allOrders)) {
            console.log(`✅ Test 10 PASADO: Obtenidas ${allOrders.length} orders`);
            passed++;
        } else {
            console.log('❌ Test 10 FALLIDO: No se pudieron obtener las orders');
            failed++;
        }
    } catch (error) {
        console.log('❌ Test 10 FALLIDO:', error.message);
        failed++;
    }
    
    // Test 11: Obtener todas las orders
    try {
        console.log('\n🔄 Test 11: Obtener todas las orders...');
        const allOrders = await getOrders();
        
        if (Array.isArray(allOrders)) {
            console.log(`✅ Test 11 PASADO: Obtenidas ${allOrders.length} orders`);
            passed++;
        } else {
            console.log('❌ Test 11 FALLIDO: No se pudieron obtener las orders');
            failed++;
        }
    } catch (error) {
        console.log('❌ Test 11 FALLIDO:', error.message);
        failed++;
    }
    
    // Test 12: Obtener order inexistente
    try {
        console.log('\n🔄 Test 12: Obtener order inexistente...');
        const nonExistent = await getOrderById(-1);
        
        if (nonExistent === null) {
            console.log('✅ Test 12 PASADO: Retorna null para order inexistente');
            passed++;
        } else {
            console.log('❌ Test 12 FALLIDO: Debería retornar null');
            failed++;
        }
    } catch (error) {
        console.log('❌ Test 12 FALLIDO:', error.message);
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