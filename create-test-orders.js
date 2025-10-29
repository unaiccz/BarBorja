import { createClient } from '@supabase/supabase-js';

async function createTestOrders() {
    console.log('🔧 Creando orders de prueba...\n');
    
    try {
        const supabaseUrl = 'https://lfycwytcqvjxylhdvypv.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmeWN3eXRjcXZqeHlsaGR2eXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NTM3NjAsImV4cCI6MjA3NDEyOTc2MH0.xCA_8wMxKOueXs3-YnYmrZbhNb_e7NXlBZJuasKgY-4';
        
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Crear orders de prueba para diferentes mesas
        const testOrders = [
            {
                table_number: 1,
                total_amount: 15.50,
                status: 'pendiente'
            },
            {
                table_number: 1,
                total_amount: 8.75,
                status: 'preparando'
            },
            {
                table_number: 2,
                total_amount: 22.30,
                status: 'pendiente'
            },
            {
                table_number: 5,
                total_amount: 12.00,
                status: 'listo'
            }
        ];
        
        console.log('📝 Insertando orders de prueba...');
        
        for (const order of testOrders) {
            const { data, error } = await supabase
                .from('orders')
                .insert(order)
                .select();
            
            if (error) {
                console.error(`❌ Error insertando order para Mesa ${order.table_number}:`, error);
            } else {
                console.log(`✅ Order creada para Mesa ${order.table_number}: ${order.total_amount}€ (${order.status})`);
                
                // También crear algunos order_items de ejemplo
                const orderId = data[0].order_id;
                
                const testItems = [
                    {
                        order_id: orderId,
                        product_id: 1, // Asumiendo que existe un product con ID 1
                        quantity: 2,
                        price: order.total_amount / 2
                    },
                    {
                        order_id: orderId,
                        product_id: 2, // Asumiendo que existe un product con ID 2  
                        quantity: 1,
                        price: order.total_amount / 2
                    }
                ];
                
                const { error: itemsError } = await supabase
                    .from('order_items')
                    .insert(testItems);
                
                if (itemsError && !itemsError.message.includes('violates foreign key')) {
                    console.warn(`⚠️ No se pudieron crear items para order ${orderId}:`, itemsError.message);
                }
            }
        }
        
        console.log('\n🎉 Orders de prueba creadas exitosamente!');
        
        // Verificar el resultado
        console.log('\n📊 Verificando orders creadas:');
        const { data: newOrders, error: checkError } = await supabase
            .from('orders')
            .select('order_id, table_number, status, total_amount, created_at')
            .order('created_at', { ascending: false })
            .limit(10);
        
        if (checkError) {
            console.error('❌ Error verificando orders:', checkError);
        } else {
            newOrders?.forEach(order => {
                console.log(`   Mesa ${order.table_number} | Status: ${order.status} | Total: ${order.total_amount}€`);
            });
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        return false;
    }
}

// Ejecutar script
createTestOrders();