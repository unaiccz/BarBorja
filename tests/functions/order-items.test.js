// Test dedicado específicamente para Order Items
import {
  // Orders functions (necesarias para crear orders de prueba)
  createOrder,
  deleteOrder,
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

async function runOrderItemsTests() {
    console.log('🧪 Iniciando tests específicos de Order Items...\n');
    let passed = 0;
    let failed = 0;
    let testOrder = null;
    let testProduct1 = null;
    let testProduct2 = null;
    
    // Preparar datos de prueba
    try {
        console.log('🔧 Preparando: Creando productos de prueba...');
        
        // Crear primer producto
        testProduct1 = await createProduct(
            `Test Product 1 ${Date.now()}`,
            'Primer producto para testear order items',
            12.50,
            10,
            'cocina',
            ['ingrediente1', 'ingrediente2'],
            ['alérgeno1']
        );
        
        // Crear segundo producto
        testProduct2 = await createProduct(
            `Test Product 2 ${Date.now()}`,
            'Segundo producto para testear order items',
            8.75,
            15,
            'barra',
            ['agua', 'azúcar'],
            ['ninguno']
        );
        
        if (testProduct1 && testProduct2) {
            console.log(`✅ Productos de prueba creados: ID ${testProduct1.product_id} y ID ${testProduct2.product_id}`);
        } else {
            console.log('❌ No se pudieron crear productos de prueba. Tests fallarán.');
            return;
        }
        
        // Crear order de prueba
        console.log('🔧 Preparando: Creando order de prueba...');
        testOrder = await createOrder(8, 'pendiente', 30, 0); // total_amount se calculará después
        
        if (testOrder && testOrder.order_id) {
            console.log(`✅ Order de prueba creada: ID ${testOrder.order_id}`);
        } else {
            console.log('❌ No se pudo crear order de prueba. Tests fallarán.');
            return;
        }
        
    } catch (error) {
        console.log('❌ Error preparando datos de prueba:', error.message);
        return;
    }
    
    // Test 1: Crear order item
    let createdItem1 = null;
    try {
        console.log('\n🔄 Test 1: Crear primer order item...');
        createdItem1 = await createOrderItem(
            testOrder.order_id,
            testProduct1.product_id,
            2,
            testProduct1.price,
            'Sin cebolla, extra queso'
        );
        
        if (createdItem1 && createdItem1.order_item_id) {
            console.log('✅ Test 1 PASADO: Primer order item creado exitosamente');
            console.log(`   ID: ${createdItem1.order_item_id}, Producto: ${createdItem1.product_id}, Cantidad: ${createdItem1.quantity}`);
            passed++;
        } else {
            console.log('❌ Test 1 FALLIDO: No se pudo crear el primer order item');
            failed++;
        }
    } catch (error) {
        console.log('❌ Test 1 FALLIDO:', error.message);
        failed++;
    }
    
    // Test 2: Crear segundo order item
    let createdItem2 = null;
    try {
        console.log('\n🔄 Test 2: Crear segundo order item...');
        createdItem2 = await createOrderItem(
            testOrder.order_id,
            testProduct2.product_id,
            3,
            testProduct2.price,
            'Bien frío'
        );
        
        if (createdItem2 && createdItem2.order_item_id) {
            console.log('✅ Test 2 PASADO: Segundo order item creado exitosamente');
            console.log(`   ID: ${createdItem2.order_item_id}, Producto: ${createdItem2.product_id}, Cantidad: ${createdItem2.quantity}`);
            passed++;
        } else {
            console.log('❌ Test 2 FALLIDO: No se pudo crear el segundo order item');
            failed++;
        }
    } catch (error) {
        console.log('❌ Test 2 FALLIDO:', error.message);
        failed++;
    }
    
    // Test 3: Obtener order item por ID
    try {
        console.log('\n🔄 Test 3: Obtener order item por ID...');
        if (createdItem1) {
            const fetchedItem = await getOrderItemById(createdItem1.order_item_id);
            
            if (fetchedItem && fetchedItem.order_item_id === createdItem1.order_item_id) {
                console.log('✅ Test 3 PASADO: Order item obtenido por ID correctamente');
                console.log(`   Nota: "${fetchedItem.note}"`);
                passed++;
            } else {
                console.log('❌ Test 3 FALLIDO: No se pudo obtener el order item por ID');
                failed++;
            }
        } else {
            console.log('❌ Test 3 SALTADO: No hay order item para buscar');
            failed++;
        }
    } catch (error) {
        console.log('❌ Test 3 FALLIDO:', error.message);
        failed++;
    }
    
    // Test 4: Obtener todos los items de una order
    try {
        console.log('\n🔄 Test 4: Obtener todos los items de la order...');
        const orderItems = await getOrderItems(testOrder.order_id);
        
        if (Array.isArray(orderItems) && orderItems.length >= 2) {
            console.log(`✅ Test 4 PASADO: Obtenidos ${orderItems.length} items de la order`);
            orderItems.forEach((item, index) => {
                console.log(`   Item ${index + 1}: Producto ${item.product_id}, Cantidad ${item.quantity}, Precio ${item.price}`);
            });
            passed++;
        } else {
            console.log(`❌ Test 4 FALLIDO: Se esperaban al menos 2 items, se obtuvieron ${orderItems ? orderItems.length : 0}`);
            failed++;
        }
    } catch (error) {
        console.log('❌ Test 4 FALLIDO:', error.message);
        failed++;
    }
    
    // Test 5: Actualizar order item
    try {
        console.log('\n🔄 Test 5: Actualizar order item...');
        if (createdItem1) {
            const updatedItem = await updateOrderItem(createdItem1.order_item_id, {
                quantity: 4,
                note: 'Sin cebolla, extra queso, bien caliente'
            });
            
            if (updatedItem && updatedItem.quantity === 4) {
                console.log('✅ Test 5 PASADO: Order item actualizado exitosamente');
                console.log(`   Nueva cantidad: ${updatedItem.quantity}, Nueva nota: "${updatedItem.note}"`);
                passed++;
            } else {
                console.log('❌ Test 5 FALLIDO: No se pudo actualizar el order item');
                failed++;
            }
        } else {
            console.log('❌ Test 5 SALTADO: No hay order item para actualizar');
            failed++;
        }
    } catch (error) {
        console.log('❌ Test 5 FALLIDO:', error.message);
        failed++;
    }
    
    // Test 6: Obtener order con items (función combinada)
    try {
        console.log('\n🔄 Test 6: Obtener order con items...');
        const orderWithItems = await getOrderWithItems(testOrder.order_id);
        
        if (orderWithItems && orderWithItems.items && orderWithItems.items.length >= 2) {
            console.log('✅ Test 6 PASADO: Order con items obtenida exitosamente');
            console.log(`   Order ID: ${orderWithItems.order_id}, Mesa: ${orderWithItems.table_number}`);
            console.log(`   Items: ${orderWithItems.items.length}, Status: ${orderWithItems.status}`);
            passed++;
        } else {
            console.log('❌ Test 6 FALLIDO: No se pudo obtener order con items');
            failed++;
        }
    } catch (error) {
        console.log('❌ Test 6 FALLIDO:', error.message);
        failed++;
    }
    
    // Test 7: Crear order con items (función combinada)
    try {
        console.log('\n🔄 Test 7: Crear order completa con items...');
        const orderItemsData = [
            { 
                product_id: testProduct1.product_id, 
                quantity: 1, 
                price: testProduct1.price, 
                note: 'Para llevar' 
            },
            { 
                product_id: testProduct2.product_id, 
                quantity: 2, 
                price: testProduct2.price, 
                note: 'Con hielo' 
            }
        ];
        
        const newOrderWithItems = await createOrderWithItems(12, 'pendiente', 25, orderItemsData);
        
        if (newOrderWithItems && newOrderWithItems.order_id && newOrderWithItems.items.length === 2) {
            console.log('✅ Test 7 PASADO: Order completa con items creada exitosamente');
            console.log(`   Order ID: ${newOrderWithItems.order_id}, Total: €${newOrderWithItems.total_amount}`);
            console.log(`   Items creados: ${newOrderWithItems.items.length}`);
            passed++;
            
            // Limpiar esta order de prueba
            await deleteOrderItemsByOrderId(newOrderWithItems.order_id);
            await deleteOrder(newOrderWithItems.order_id);
            console.log('   Order de prueba limpiada');
            
        } else {
            console.log('❌ Test 7 FALLIDO: No se pudo crear order con items');
            failed++;
        }
    } catch (error) {
        console.log('❌ Test 7 FALLIDO:', error.message);
        failed++;
    }
    
    // Test 8: Eliminar order item específico
    try {
        console.log('\n🔄 Test 8: Eliminar order item específico...');
        if (createdItem2) {
            const deletedItem = await deleteOrderItem(createdItem2.order_item_id);
            
            if (deletedItem) {
                console.log('✅ Test 8 PASADO: Order item eliminado exitosamente');
                console.log(`   Item eliminado: ID ${deletedItem.order_item_id}`);
                passed++;
            } else {
                console.log('❌ Test 8 FALLIDO: No se pudo eliminar el order item');
                failed++;
            }
        } else {
            console.log('❌ Test 8 SALTADO: No hay order item para eliminar');
            failed++;
        }
    } catch (error) {
        console.log('❌ Test 8 FALLIDO:', error.message);
        failed++;
    }
    
    // Test 9: Eliminar todos los items de una order
    try {
        console.log('\n🔄 Test 9: Eliminar todos los items de la order...');
        const deletedItems = await deleteOrderItemsByOrderId(testOrder.order_id);
        
        if (deletedItems && Array.isArray(deletedItems)) {
            console.log(`✅ Test 9 PASADO: ${deletedItems.length} items eliminados de la order`);
            passed++;
        } else {
            console.log('❌ Test 9 FALLIDO: No se pudieron eliminar los items de la order');
            failed++;
        }
    } catch (error) {
        console.log('❌ Test 9 FALLIDO:', error.message);
        failed++;
    }
    
    // Test 10: Verificar que no quedan items
    try {
        console.log('\n🔄 Test 10: Verificar que no quedan items en la order...');
        const remainingItems = await getOrderItems(testOrder.order_id);
        
        if (Array.isArray(remainingItems) && remainingItems.length === 0) {
            console.log('✅ Test 10 PASADO: No quedan items en la order (limpieza exitosa)');
            passed++;
        } else {
            console.log(`❌ Test 10 FALLIDO: Aún quedan ${remainingItems ? remainingItems.length : 'algunos'} items`);
            failed++;
        }
    } catch (error) {
        console.log('❌ Test 10 FALLIDO:', error.message);
        failed++;
    }
    
    // Test 11: Obtener order item inexistente
    try {
        console.log('\n🔄 Test 11: Obtener order item inexistente...');
        const nonExistentItem = await getOrderItemById(-1);
        
        if (nonExistentItem === null) {
            console.log('✅ Test 11 PASADO: Retorna null para order item inexistente');
            passed++;
        } else {
            console.log('❌ Test 11 FALLIDO: Debería retornar null');
            failed++;
        }
    } catch (error) {
        console.log('❌ Test 11 FALLIDO:', error.message);
        failed++;
    }
    
    // Limpieza final
    try {
        console.log('\n🧹 Limpieza final...');
        
        if (testOrder) {
            await deleteOrder(testOrder.order_id);
            console.log('✅ Order de prueba eliminada');
        }
        
        if (testProduct1) {
            await deleteProduct(testProduct1.product_id);
            console.log('✅ Primer producto de prueba eliminado');
        }
        
        if (testProduct2) {
            await deleteProduct(testProduct2.product_id);
            console.log('✅ Segundo producto de prueba eliminado');
        }
        
    } catch (error) {
        console.log('⚠️  Error en limpieza final:', error.message);
    }
    
    // Resumen
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE TESTS DE ORDER ITEMS:');
    console.log(`✅ Pasados: ${passed}`);
    console.log(`❌ Fallidos: ${failed}`);
    console.log(`📈 Total: ${passed + failed}`);
    
    if (failed === 0) {
        console.log('\n🎉 ¡Todos los tests de order items pasaron exitosamente!');
    } else {
        console.log('\n⚠️  Algunos tests fallaron. Revisa la configuración.');
    }
    
    console.log('\n📋 Funcionalidades verificadas:');
    console.log('   • Crear order items individuales');
    console.log('   • Obtener order items por ID');
    console.log('   • Obtener todos los items de una order');
    console.log('   • Actualizar order items');
    console.log('   • Eliminar order items específicos');
    console.log('   • Eliminar todos los items de una order');
    console.log('   • Crear orders completas con items');
    console.log('   • Obtener orders con sus items');
    console.log('   • Manejo de casos inexistentes');
    console.log('   • Limpieza automática de datos de prueba');
}

// Ejecutar tests
runOrderItemsTests().catch(error => {
    console.error('💥 Error ejecutando tests de order items:', error);
    process.exit(1);
});