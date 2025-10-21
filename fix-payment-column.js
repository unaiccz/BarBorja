// Script para agregar la columna payment_method directamente
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixPaymentColumn() {
    console.log('🔄 Verificando y agregando columna payment_method...');
    
    try {
        // Primero, intentar hacer una consulta para ver la estructura actual
        console.log('🔍 Verificando estructura actual...');
        const { data: currentData, error: selectError } = await supabase
            .from('pedidos_domicilio')
            .select('*')
            .limit(1);

        if (selectError) {
            console.error('❌ Error consultando tabla:', selectError);
            return;
        }

        console.log('📊 Datos actuales encontrados:', currentData);

        // Intentar insertar un registro de prueba con payment_method
        console.log('🧪 Probando inserción con payment_method...');
        const testData = {
            nombre: 'Test Usuario',
            telefono: '123456789',
            direccion: 'Test Address',
            productos: [{ name: 'Test Product', price: 10, quantity: 1 }],
            total: 10,
            is_paid: false,
            payment_method: 'test'
        };

        const { data: insertData, error: insertError } = await supabase
            .from('pedidos_domicilio')
            .insert(testData)
            .select();

        if (insertError) {
            console.error('❌ Error insertando con payment_method:', insertError);
            console.log('💡 La columna payment_method no existe, necesita ser creada manualmente');
            
            // Intentar insertar sin payment_method para verificar que la tabla base funciona
            console.log('🧪 Probando inserción sin payment_method...');
            const testDataWithoutPayment = {
                nombre: 'Test Usuario Sin Payment',
                telefono: '123456789',
                direccion: 'Test Address',
                productos: [{ name: 'Test Product', price: 10, quantity: 1 }],
                total: 10,
                is_paid: false
            };

            const { data: insertData2, error: insertError2 } = await supabase
                .from('pedidos_domicilio')
                .insert(testDataWithoutPayment)
                .select();

            if (insertError2) {
                console.error('❌ Error insertando sin payment_method:', insertError2);
            } else {
                console.log('✅ Inserción sin payment_method exitosa:', insertData2);
                
                // Limpiar el registro de prueba
                if (insertData2 && insertData2[0]) {
                    await supabase
                        .from('pedidos_domicilio')
                        .delete()
                        .eq('id', insertData2[0].id);
                    console.log('🧹 Registro de prueba eliminado');
                }
            }
        } else {
            console.log('✅ Inserción con payment_method exitosa:', insertData);
            
            // Limpiar el registro de prueba
            if (insertData && insertData[0]) {
                await supabase
                    .from('pedidos_domicilio')
                    .delete()
                    .eq('id', insertData[0].id);
                console.log('🧹 Registro de prueba eliminado');
            }
        }

    } catch (error) {
        console.error('❌ Error general:', error);
    }
}

fixPaymentColumn();