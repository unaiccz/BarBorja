import { supabase } from '../src/db/supabase.js';

console.log('🔍 Depurando datos de orders...\n');

async function debugOrders() {
    try {
        // 1. Consultar TODAS las orders
        console.log('1️⃣ Consultando TODAS las orders:');
        const { data: allOrders, error: allError } = await supabase
            .from('orders')
            .select('order_id, table_number, status, total_amount, created_at')
            .order('created_at', { ascending: false });
        
        if (allError) {
            console.error('❌ Error consultando todas las orders:', allError);
            return;
        }
        
        console.log('📊 Total de orders encontradas:', allOrders?.length || 0);
        if (allOrders && allOrders.length > 0) {
            console.log('📋 Primeras 5 orders:');
            allOrders.slice(0, 5).forEach(order => {
                console.log(`   Mesa ${order.table_number} | Status: ${order.status} | Total: ${order.total_amount}€ | ${order.created_at}`);
            });
            
            // Ver qué table_numbers existen
            const tableNumbers = [...new Set(allOrders.map(o => o.table_number))].sort((a, b) => a - b);
            console.log('🏓 Mesas con orders:', tableNumbers);
            
            // Ver qué status existen
            const statuses = [...new Set(allOrders.map(o => o.status))];
            console.log('📈 Status encontrados:', statuses);
        }
        
        console.log('\n2️⃣ Consultando orders para Mesa 1:');
        const { data: mesa1Orders, error: mesa1Error } = await supabase
            .from('orders')
            .select('order_id, table_number, status, total_amount, created_at')
            .eq('table_number', 1)
            .order('created_at', { ascending: false });
        
        if (mesa1Error) {
            console.error('❌ Error consultando Mesa 1:', mesa1Error);
        } else {
            console.log('📊 Orders para Mesa 1:', mesa1Orders?.length || 0);
            mesa1Orders?.forEach(order => {
                console.log(`   Order ${order.order_id} | Status: ${order.status} | Total: ${order.total_amount}€`);
            });
        }
        
        console.log('\n✅ Debug completado');
    } catch (error) {
        console.error('💥 Error inesperado:', error);
    }
}

debugOrders();