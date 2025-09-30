 // Cargar variables de entorno
import dotenv from 'dotenv';
dotenv.config();

import { supabase } from './supabase.js';

export async function diagnoseConnection() {
    console.log('🔍 Diagnosticando conexión a Supabase...');
    
    try {
        // Test 1: Verificar que el cliente se creó correctamente
        console.log('✅ Cliente de Supabase creado');
        
        // Test 2: Probar una consulta simple
        console.log('🔄 Probando consulta a la tabla products...');
        const { data, error, count } = await supabase
            .from('products')
            .select('*', { count: 'exact' });
        
        if (error) {
            console.error('❌ Error en la consulta:', error);
            console.error('Detalles del error:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            return false;
        }
        
        console.log('✅ Consulta exitosa');
        console.log(`📊 Productos encontrados: ${count || data?.length || 0}`);
        
        if (data && data.length > 0) {
            console.log('📝 Primer producto:', data[0]);
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Error inesperado:', error);
        return false;
    }
}

// Función para verificar variables de entorno
export function checkEnvironmentVariables() {
    console.log('🔍 Verificando variables de entorno...');
    
    const checks = [
        { name: 'SUPABASE_URL', value: import.meta.env?.SUPABASE_URL || process.env?.SUPABASE_URL },
        { name: 'SUPABASE_KEY', value: import.meta.env?.SUPABASE_KEY || process.env?.SUPABASE_KEY }
    ];
    
    checks.forEach(check => {
        if (check.value) {
            console.log(`✅ ${check.name}: Configurada (${check.value.substring(0, 20)}...)`);
        } else {
            console.log(`❌ ${check.name}: No configurada`);
        }
    });
    
    return checks.every(check => check.value);
}

// Ejecutar diagnóstico completo
export async function fullDiagnosis() {
    console.log('🚀 Iniciando diagnóstico completo...\n');
    
    const envOk = checkEnvironmentVariables();
    console.log('');
    
    if (!envOk) {
        console.log('❌ Variables de entorno no configuradas correctamente');
        return false;
    }
    
    const connectionOk = await diagnoseConnection();
    
    console.log('\n📋 Resumen del diagnóstico:');
    console.log(`- Variables de entorno: ${envOk ? '✅' : '❌'}`);
    console.log(`- Conexión a Supabase: ${connectionOk ? '✅' : '❌'}`);
    
    return envOk && connectionOk;
}