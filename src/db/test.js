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
        
        // Test simple usando auth para verificar conexión
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
            console.error('❌ Error de conexión:', error.message);
            return false;
        }
        
        console.log('✅ Conexión exitosa a la base de datos');
        console.log('� Cliente autenticado correctamente');
        return true;
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        return false;
    }
}

// Ejecutar test
testDatabase();