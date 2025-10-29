require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Variables de entorno no configuradas');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getAllMesaURLs() {
    console.log('🔍 Obteniendo todas las URLs de mesas...\n');
    
    const { data, error } = await supabase
        .from('mesa_tokens')
        .select('*')
        .eq('activo', true)
        .order('mesa_numero');
    
    if (error) {
        console.error('❌ Error:', error.message);
        return;
    }
    
    console.log(`✅ Total de mesas activas: ${data.length}\n`);
    console.log('=' .repeat(80));
    console.log('URLS PARA CÓDIGOS QR - COPIAR Y PEGAR');
    console.log('=' .repeat(80));
    console.log('\n');
    
    // Cambiar localhost por tu dominio en producción
    const baseUrl = 'http://localhost:4321'; // Cambiar a tu dominio real
    
    data.forEach(token => {
        const url = `${baseUrl}/mesa/access?token=${token.token}`;
        console.log(`Mesa ${token.mesa_numero}:`);
        console.log(url);
        console.log('');
    });
    
    console.log('=' .repeat(80));
    console.log('\n📝 INSTRUCCIONES:');
    console.log('1. Copia cada URL');
    console.log('2. Ve a un generador de QR online (ej: qr-code-generator.com)');
    console.log('3. Pega la URL y genera el código QR');
    console.log('4. Descarga e imprime el QR para cada mesa');
    console.log('\n💡 O usa la página /admin/mesas-qr para generar todos los QR automáticamente');
    console.log('\n⚠️  IMPORTANTE: En producción, cambia "localhost:4321" por tu dominio real');
    console.log('   Ejemplo: https://tu-restaurante.com/mesa/access?token=...');
}

getAllMesaURLs().catch(console.error);
