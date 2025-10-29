import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno desde .env en la raíz del proyecto
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function testDatabase() {
    console.log('Probando conexión a la base de datos...');
    
    try {
        // Crear cliente usando variables de entorno de Node.js
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
            console.error('❌ Variables de entorno SUPABASE_URL y SUPABASE_KEY no configuradas');
            console.log('💡 Crea un archivo .env con:');
            console.log('   SUPABASE_URL=tu_url_aqui');
            console.log('   SUPABASE_KEY=tu_key_aqui');
            return false;
        }
        
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // 1. Consultar TODAS las orders
        console.log('1️⃣ Consultando TODAS las orders:');
        const { data: allOrders, error: allError } = await supabase
            .from('orders')
            .select('order_id, table_number, status, total_amount, created_at')
            .order('created_at', { ascending: false });
        
        if (allError) {
            console.error('❌ Error consultando todas las orders:', allError);
            return false;
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
        
        console.log('\n✅ Debug de orders completado');
        return true;
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        return false;
    }
}

// Ejecutar test
testDatabase();