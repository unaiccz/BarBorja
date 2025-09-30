import { createClient } from "@supabase/supabase-js";

// Función para obtener variables de entorno de manera robusta
function getEnvVar(name) {
    // Primero intenta import.meta.env (Astro/Vite)
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        return import.meta.env[name];
    }
    
    // Fallback a process.env (Node.js)
    if (typeof process !== 'undefined' && process.env) {
        return process.env[name];
    }
    
    return undefined;
}

const supabaseUrl = getEnvVar('SUPABASE_URL');
const supabaseKey = getEnvVar('SUPABASE_KEY');

// Validación de variables de entorno
if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables de entorno SUPABASE_URL y SUPABASE_KEY no configuradas');
    console.log('Configuración actual:');
    console.log('- SUPABASE_URL:', supabaseUrl ? 'Configurada' : 'No configurada');
    console.log('- SUPABASE_KEY:', supabaseKey ? 'Configurada' : 'No configurada');
    throw new Error('Variables de entorno de Supabase no configuradas');
}

export const supabase = createClient(supabaseUrl, supabaseKey);