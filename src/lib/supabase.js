// Cliente de Supabase para uso en el navegador
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase no configurado correctamente');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
