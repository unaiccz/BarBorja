-- Agregar columna stripe_payment_id a la tabla pedidos_domicilio
ALTER TABLE pedidos_domicilio 
ADD COLUMN IF NOT EXISTS stripe_payment_id VARCHAR(255);

-- Crear índice para búsquedas eficientes por ID de pago de Stripe
CREATE INDEX IF NOT EXISTS idx_pedidos_domicilio_stripe_payment_id 
ON pedidos_domicilio(stripe_payment_id);

-- Verificar que la columna se agregó correctamente
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'pedidos_domicilio' 
AND column_name = 'stripe_payment_id';