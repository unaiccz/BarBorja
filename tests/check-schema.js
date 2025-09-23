import { supabase } from '../src/db/supabase-test.js';

async function checkDatabaseSchema() {
    console.log('🔍 Verificando esquema de la base de datos...\n');
    
    try {
        // Verificar si la tabla existe
        console.log('📋 Verificando tabla products...');
        const { data: tables, error: tableError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_name', 'products');
            
        if (tableError) {
            console.log('❌ Error verificando tabla:', tableError.message);
        } else if (tables && tables.length > 0) {
            console.log('✅ Tabla products existe');
        } else {
            console.log('❌ Tabla products no encontrada');
            return;
        }
        
        // Verificar columnas
        console.log('\n📊 Verificando columnas de la tabla...');
        const { data: columns, error: columnError } = await supabase
            .from('information_schema.columns')
            .select('column_name, data_type, is_nullable')
            .eq('table_name', 'products');
            
        if (columnError) {
            console.log('❌ Error verificando columnas:', columnError.message);
        } else if (columns && columns.length > 0) {
            console.log('✅ Columnas encontradas:');
            columns.forEach(col => {
                console.log(`   - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
            });
        }
        
        // Intentar obtener productos existentes para ver la estructura
        console.log('\n🗂️  Verificando productos existentes...');
        const { data: products, error: productError } = await supabase
            .from('products')
            .select('*')
            .limit(3);
            
        if (productError) {
            console.log('❌ Error obteniendo productos:', productError.message);
        } else if (products && products.length > 0) {
            console.log(`✅ Encontrados ${products.length} productos:`);
            products.forEach((product, index) => {
                console.log(`   ${index + 1}. ${product.name} (tipo: ${product.type})`);
            });
        } else {
            console.log('ℹ️  No hay productos en la base de datos');
        }
        
        // Verificar restricciones
        console.log('\n🔒 Verificando restricciones...');
        const { data: constraints, error: constraintError } = await supabase
            .from('information_schema.check_constraints')
            .select('constraint_name, check_clause')
            .like('constraint_name', '%products%');
            
        if (constraintError) {
            console.log('❌ Error verificando restricciones:', constraintError.message);
        } else if (constraints && constraints.length > 0) {
            console.log('✅ Restricciones encontradas:');
            constraints.forEach(constraint => {
                console.log(`   - ${constraint.constraint_name}: ${constraint.check_clause}`);
            });
        }
        
    } catch (error) {
        console.error('💥 Error general:', error);
    }
}

checkDatabaseSchema();