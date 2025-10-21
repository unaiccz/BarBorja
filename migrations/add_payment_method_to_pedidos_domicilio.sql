-- Agregar campo payment_method a pedidos_domicilio si no existe
-- Fecha: 20 de octubre de 2025

-- Agregar columna payment_method si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pedidos_domicilio' 
        AND column_name = 'payment_method'
    ) THEN
        ALTER TABLE pedidos_domicilio ADD COLUMN payment_method VARCHAR(50);
        COMMENT ON COLUMN pedidos_domicilio.payment_method IS 'Método de pago utilizado: tarjeta, efectivo, etc.';
    END IF;
END $$;