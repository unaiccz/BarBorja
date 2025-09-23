// Importar funciones a testear
import {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct
} from '../../src/functions/products-test.js';

async function runTests() {
    console.log('🧪 Iniciando tests de productos...\n');
    let passed = 0;
    let failed = 0;
    
    // Helper para crear datos de prueba
    const makeTestProduct = () => ({
        name: `Test Product ${Date.now()}`,
        description: 'Producto de prueba',
        price: 19.99,
        stock: 10,
        type: 'cocina', // Usando un tipo válido
        ingredients: ['agua', 'azúcar'],
        allergens: ['ninguno']
    });
    
    // Test 1: Crear producto
    try {
        console.log('🔄 Test 1: Crear producto...');
        const productData = makeTestProduct();
        const created = await createProduct(
            productData.name,
            productData.description,
            productData.price,
            productData.stock,
            productData.type,
            productData.ingredients,
            productData.allergens
        );
        
        if (created && created.product_id) {
            console.log('✅ Test 1 PASADO: Producto creado exitosamente');
            console.log(`   ID: ${created.product_id}, Nombre: ${created.name}`);
            passed++;
            
            // Test 2: Obtener producto por ID
            try {
                console.log('\n🔄 Test 2: Obtener producto por ID...');
                const fetched = await getProductById(created.product_id);
                
                if (fetched && fetched.product_id === created.product_id) {
                    console.log('✅ Test 2 PASADO: Producto obtenido por ID');
                    passed++;
                } else {
                    console.log('❌ Test 2 FALLIDO: No se pudo obtener el producto por ID');
                    failed++;
                }
            } catch (error) {
                console.log('❌ Test 2 FALLIDO:', error.message);
                failed++;
            }
            
            // Test 3: Obtener todos los productos
            try {
                console.log('\n🔄 Test 3: Obtener todos los productos...');
                const products = await getProducts();
                
                if (Array.isArray(products) && products.length > 0) {
                    console.log(`✅ Test 3 PASADO: Obtenidos ${products.length} productos`);
                    passed++;
                } else {
                    console.log('❌ Test 3 FALLIDO: No se obtuvieron productos');
                    failed++;
                }
            } catch (error) {
                console.log('❌ Test 3 FALLIDO:', error.message);
                failed++;
            }
            
            // Test 4: Eliminar producto
            try {
                console.log('\n🔄 Test 4: Eliminar producto...');
                const deleted = await deleteProduct(created.product_id);
                
                if (deleted) {
                    console.log('✅ Test 4 PASADO: Producto eliminado exitosamente');
                    passed++;
                } else {
                    console.log('❌ Test 4 FALLIDO: No se pudo eliminar el producto');
                    failed++;
                }
            } catch (error) {
                console.log('❌ Test 4 FALLIDO:', error.message);
                failed++;
            }
            
        } else {
            console.log('❌ Test 1 FALLIDO: No se pudo crear el producto');
            failed++;
        }
    } catch (error) {
        console.log('❌ Test 1 FALLIDO:', error.message);
        failed++;
    }
    
    // Test 5: Obtener producto inexistente
    try {
        console.log('\n🔄 Test 5: Obtener producto inexistente...');
        const nonExistent = await getProductById(-1);
        
        if (nonExistent === null) {
            console.log('✅ Test 5 PASADO: Retorna null para producto inexistente');
            passed++;
        } else {
            console.log('❌ Test 5 FALLIDO: Debería retornar null');
            failed++;
        }
    } catch (error) {
        console.log('❌ Test 5 FALLIDO:', error.message);
        failed++;
    }
    
    // Resumen
    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMEN DE TESTS:');
    console.log(`✅ Pasados: ${passed}`);
    console.log(`❌ Fallidos: ${failed}`);
    console.log(`📈 Total: ${passed + failed}`);
    
    if (failed === 0) {
        console.log('\n🎉 ¡Todos los tests pasaron exitosamente!');
    } else {
        console.log('\n⚠️  Algunos tests fallaron. Revisa la configuración.');
    }
}

// Ejecutar tests
runTests().catch(error => {
    console.error('💥 Error ejecutando tests:', error);
    process.exit(1);
});