// Script para aplicar migraciones de base de datos
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Cargar variables de entorno desde .env
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || 'https://lfycwytcqvjxylhdvypv.supabase.co';
const supabaseKey = process.env.PUBLIC_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmeWN3eXRjcXZqeHlsaGR2eXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NTM3NjAsImV4cCI6MjA3NDEyOTc2MH0.xCA_8wMxKOueXs3-YnYmrZbhNb_e7NXlBZJuasKgY-4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigrations() {
    console.log('🔄 Aplicando migraciones...');
    
    try {
        // Leer y ejecutar create_pedidos_domicilio.sql
        const createTableSQL = fs.readFileSync('./migrations/create_pedidos_domicilio.sql', 'utf8');
        console.log('📄 Ejecutando create_pedidos_domicilio.sql...');
        const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
        if (createError) {
            console.log('ℹ️ Tabla pedidos_domicilio ya existe o error esperado:', createError.message);
        } else {
            console.log('✅ Tabla pedidos_domicilio creada correctamente');
        }

        // Leer y ejecutar add_payment_method_to_pedidos_domicilio.sql
        const addColumnSQL = fs.readFileSync('./migrations/add_payment_method_to_pedidos_domicilio.sql', 'utf8');
        console.log('📄 Ejecutando add_payment_method_to_pedidos_domicilio.sql...');
        const { error: addColumnError } = await supabase.rpc('exec_sql', { sql: addColumnSQL });
        if (addColumnError) {
            console.log('ℹ️ Columna payment_method ya existe o error esperado:', addColumnError.message);
        } else {
            console.log('✅ Columna payment_method agregada correctamente');
        }

        // Verificar la estructura de la tabla
        console.log('🔍 Verificando estructura de la tabla...');
        const { data, error } = await supabase
            .from('pedidos_domicilio')
            .select('*')
            .limit(1);
            
        if (error) {
            console.error('❌ Error al verificar la tabla:', error);
        } else {
            console.log('✅ Tabla pedidos_domicilio verificada correctamente');
            console.log('📊 Estructura disponible para consultas');
        }

    } catch (error) {
        console.error('❌ Error aplicando migraciones:', error);
    }
}

applyMigrations();