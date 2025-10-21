-- Añadir columna stripe_payment_id a la tabla pedidos_domicilio
ALTER TABLE pedidos_domicilio 
ADD COLUMN stripe_payment_id VARCHAR(255);

-- Añadir índice para mejorar el rendimiento de las búsquedas por stripe_payment_id
CREATE INDEX idx_pedidos_domicilio_stripe_payment_id ON pedidos_domicilio(stripe_payment_id);

-- Comentario sobre la columna
COMMENT ON COLUMN pedidos_domicilio.stripe_payment_id IS 'ID del método de pago de Stripe para el pedido';