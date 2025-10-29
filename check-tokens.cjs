require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Variables de entorno no configuradas');
    console.log('Asegúrate de tener SUPABASE_URL y SUPABASE_KEY en tu archivo .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTokens() {
    console.log('🔍 Verificando tabla mesa_tokens...\n');
    
    const { data, error } = await supabase
        .from('mesa_tokens')
        .select('*')
        .order('mesa_numero')
        .limit(5);
    
    if (error) {
        console.error('❌ Error:', error.message);
        console.log('\n⚠️  La tabla mesa_tokens no existe o hay un problema.');
        console.log('📝 Necesitas ejecutar la migración: migrations/create_mesa_tokens.sql\n');
        console.log('Pasos para solucionar:');
        console.log('1. Ve a tu panel de Supabase');
        console.log('2. Abre el SQL Editor');
        console.log('3. Ejecuta el contenido del archivo migrations/create_mesa_tokens.sql');
        return;
    }
    
    console.log('✅ Tabla mesa_tokens existe');
    console.log(`📊 Total de tokens encontrados: ${data.length}\n`);
    
    if (data.length === 0) {
        console.log('⚠️  No hay tokens generados.');
        console.log('Ejecuta la migración para crear los tokens iniciales.\n');
        return;
    }
    
    console.log('📋 Ejemplos de tokens:\n');
    data.forEach(token => {
        console.log(`Mesa ${token.mesa_numero}:`);
        console.log(`  Token: ${token.token}`);
        console.log(`  Activo: ${token.activo ? '✅' : '❌'}`);
        console.log(`  URL: http://localhost:4321/mesa/access?token=${token.token}`);
        console.log('');
    });
    
    console.log('💡 Para acceder a una mesa:');
    console.log('   1. Copia la URL de arriba');
    console.log('   2. Pégala en tu navegador');
    console.log('   3. O genera un código QR desde /admin/mesas-qr\n');
}

checkTokens().catch(console.error);
