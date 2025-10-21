-- SQL completo para arreglar la tabla pedidos_domicilio

-- 1. Hacer apellidos opcional si es requerido
ALTER TABLE pedidos_domicilio 
ALTER COLUMN apellidos DROP NOT NULL;

-- 2. Hacer dni opcional si es requerido  
ALTER TABLE pedidos_domicilio 
ALTER COLUMN dni DROP NOT NULL;

-- 3. Agregar columnas que faltan
ALTER TABLE pedidos_domicilio 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20) DEFAULT 'efectivo';

ALTER TABLE pedidos_domicilio 
ADD COLUMN IF NOT EXISTS stripe_payment_id VARCHAR(255);

-- 4. Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_pedidos_domicilio_payment_method 
ON pedidos_domicilio(payment_method);

CREATE INDEX IF NOT EXISTS idx_pedidos_domicilio_stripe_payment_id 
ON pedidos_domicilio(stripe_payment_id);

CREATE INDEX IF NOT EXISTS idx_pedidos_domicilio_is_paid 
ON pedidos_domicilio(is_paid);

CREATE INDEX IF NOT EXISTS idx_pedidos_domicilio_created_at 
ON pedidos_domicilio(created_at);

-- 5. Verificar estructura final
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'pedidos_domicilio' 
ORDER BY ordinal_position;