import { createClient } from "@supabase/supabase-js";

// Variables de entorno para Supabase
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_KEY || import.meta.env.SUPABASE_KEY;

// Validación de variables de entorno
if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables de entorno de Supabase no configuradas');
    console.error('Configuración actual:');
    console.error('- SUPABASE_URL:', supabaseUrl ? '✅ Configurada' : '❌ No configurada');
    console.error('- SUPABASE_KEY:', supabaseKey ? '✅ Configurada' : '❌ No configurada');
    console.error('Verifica que tengas las variables PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_KEY en tu archivo .env');
    throw new Error('Variables de entorno de Supabase no configuradas');
}

console.log('🔗 Conectando a Supabase...');
console.log('🔗 Supabase URL:', supabaseUrl.substring(0, 30) + '...');

export const supabase = createClient(supabaseUrl, supabaseKey);