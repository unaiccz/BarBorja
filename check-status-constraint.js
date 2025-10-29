import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

async function checkOrdersSchema() {
    console.log('🔍 Revisando schema de la tabla orders...\n');
    
    try {
        const supabaseUrl = 'https://lfycwytcqvjxylhdvypv.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmeWN3eXRjcXZqeHlsaGR2eXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NTM3NjAsImV4cCI6MjA3NDEyOTc2MH0.xCA_8wMxKOueXs3-YnYmrZbhNb_e7NXlBZJuasKgY-4';
        
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Probar diferentes valores de status para ver cuáles están permitidos
        const testStatuses = [
            'pendiente',
            'preparando', 
            'listo',
            'entregado',
            'pagado',
            'cancelado',
            'en_curso',
            'completado'
        ];
        
        console.log('🧪 Probando diferentes valores de status...\n');
        
        for (const status of testStatuses) {
            try {
                // Intentar crear una order de prueba para ver si el status es válido
                const { data, error } = await supabase
                    .from('orders')
                    .insert({
                        table_number: 999, // Mesa ficticia
                        total_amount: 0.01,
                        status: status,
                        payment_method: 'test'
                    })
                    .select();
                
                if (error) {
                    if (error.code === '23514') {
                        console.log(`❌ Status '${status}' NO permitido`);
                    } else {
                        console.log(`⚠️  Status '${status}' - Error diferente:`, error.message);
                    }
                } else {
                    console.log(`✅ Status '${status}' permitido`);
                    // Limpiar el registro de prueba
                    if (data && data[0]) {
                        await supabase
                            .from('orders')
                            .delete()
                            .eq('order_id', data[0].order_id);
                    }
                }
            } catch (err) {
                console.log(`💥 Status '${status}' - Error inesperado:`, err.message);
            }
        }
        
        console.log('\n✅ Prueba de status completada');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkOrdersSchema();