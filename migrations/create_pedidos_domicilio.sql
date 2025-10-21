-- Crear tabla para pedidos a domicilio
-- Fecha: 20 de octubre de 2025

CREATE TABLE IF NOT EXISTS pedidos_domicilio (
    id SERIAL PRIMARY KEY,
    -- Información del cliente
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(150) NOT NULL,
    dni VARCHAR(20) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion TEXT NOT NULL,
    
    -- Información del pedido
    productos JSONB NOT NULL, -- Array de productos con {id, nombre, cantidad, precio}
    total DECIMAL(10,2) NOT NULL,
    
    -- Estado del pago
    is_paid BOOLEAN DEFAULT FALSE,
    payment_method VARCHAR(50), -- 'tarjeta', 'efectivo', etc.
    
    -- Campos de auditoría
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_pedidos_domicilio_dni ON pedidos_domicilio(dni);
CREATE INDEX IF NOT EXISTS idx_pedidos_domicilio_telefono ON pedidos_domicilio(telefono);
CREATE INDEX IF NOT EXISTS idx_pedidos_domicilio_is_paid ON pedidos_domicilio(is_paid);
CREATE INDEX IF NOT EXISTS idx_pedidos_domicilio_created_at ON pedidos_domicilio(created_at);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pedidos_domicilio_updated_at 
    BEFORE UPDATE ON pedidos_domicilio 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comentarios para documentar la tabla
COMMENT ON TABLE pedidos_domicilio IS 'Tabla para almacenar pedidos a domicilio';
COMMENT ON COLUMN pedidos_domicilio.productos IS 'Array JSON con los productos del pedido: [{id, nombre, cantidad, precio}]';
COMMENT ON COLUMN pedidos_domicilio.is_paid IS 'Estado del pago: true si está pagado, false si está pendiente';
COMMENT ON COLUMN pedidos_domicilio.total IS 'Importe total del pedido en euros';