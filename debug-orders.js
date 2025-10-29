// Debug script para revisar orders en la base de datos
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hrlxxgfqoyfrfgonlsnf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhybHh4Z2Zxb3lmcmZnb25sc25mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5NjUzMjEsImV4cCI6MjA1MTU0MTMyMX0.yWJXJhK-OYJ3sXlQhfJTrvFkqWWDnacI8ioNxFkjnYo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugOrders() {
    console.log('🔍 Depurando datos de orders...\n');
    
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
    
    console.log('\n2️⃣ Consultando orders para Mesa 1 (sin filtro de status):');
    const { data: mesa1All, error: mesa1AllError } = await supabase
        .from('orders')
        .select('order_id, table_number, status, total_amount, created_at')
        .eq('table_number', 1)
        .order('created_at', { ascending: false });
    
    if (mesa1AllError) {
        console.error('❌ Error consultando Mesa 1:', mesa1AllError);
    } else {
        console.log('📊 Orders para Mesa 1 (todos los status):', mesa1All?.length || 0);
        mesa1All?.forEach(order => {
            console.log(`   Order ${order.order_id} | Status: ${order.status} | Total: ${order.total_amount}€`);
        });
    }
    
    console.log('\n3️⃣ Consultando orders para Mesa 1 (excluyendo cancelado):');
    const { data: mesa1Active, error: mesa1ActiveError } = await supabase
        .from('orders')
        .select('order_id, table_number, status, total_amount, created_at')
        .eq('table_number', 1)
        .neq('status', 'cancelado')
        .order('created_at', { ascending: false });
    
    if (mesa1ActiveError) {
        console.error('❌ Error consultando Mesa 1 activas:', mesa1ActiveError);
    } else {
        console.log('📊 Orders activas para Mesa 1:', mesa1Active?.length || 0);
        mesa1Active?.forEach(order => {
            console.log(`   Order ${order.order_id} | Status: ${order.status} | Total: ${order.total_amount}€`);
        });
    }
    
    console.log('\n✅ Debug completado');
}

debugOrders().catch(console.error);