-- Script para agregar la columna image_url a la tabla products
-- Ejecuta este comando en Supabase SQL Editor

ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Verificar que la columna se agregó correctamente
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'image_url';
