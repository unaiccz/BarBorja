-- Crear tabla para tokens de acceso a mesas
-- Fecha: 21 de octubre de 2025

CREATE TABLE IF NOT EXISTS mesa_tokens (
    id SERIAL PRIMARY KEY,
    mesa_numero INTEGER NOT NULL UNIQUE,
    token VARCHAR(32) NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP WITH TIME ZONE
);

-- Generar tokens únicos para mesas 1-50
INSERT INTO mesa_tokens (mesa_numero, token) VALUES
(1, 'mesa_1_' || encode(gen_random_bytes(12), 'hex')),
(2, 'mesa_2_' || encode(gen_random_bytes(12), 'hex')),
(3, 'mesa_3_' || encode(gen_random_bytes(12), 'hex')),
(4, 'mesa_4_' || encode(gen_random_bytes(12), 'hex')),
(5, 'mesa_5_' || encode(gen_random_bytes(12), 'hex')),
(6, 'mesa_6_' || encode(gen_random_bytes(12), 'hex')),
(7, 'mesa_7_' || encode(gen_random_bytes(12), 'hex')),
(8, 'mesa_8_' || encode(gen_random_bytes(12), 'hex')),
(9, 'mesa_9_' || encode(gen_random_bytes(12), 'hex')),
(10, 'mesa_10_' || encode(gen_random_bytes(12), 'hex')),
(11, 'mesa_11_' || encode(gen_random_bytes(12), 'hex')),
(12, 'mesa_12_' || encode(gen_random_bytes(12), 'hex')),
(13, 'mesa_13_' || encode(gen_random_bytes(12), 'hex')),
(14, 'mesa_14_' || encode(gen_random_bytes(12), 'hex')),
(15, 'mesa_15_' || encode(gen_random_bytes(12), 'hex')),
(16, 'mesa_16_' || encode(gen_random_bytes(12), 'hex')),
(17, 'mesa_17_' || encode(gen_random_bytes(12), 'hex')),
(18, 'mesa_18_' || encode(gen_random_bytes(12), 'hex')),
(19, 'mesa_19_' || encode(gen_random_bytes(12), 'hex')),
(20, 'mesa_20_' || encode(gen_random_bytes(12), 'hex')),
(21, 'mesa_21_' || encode(gen_random_bytes(12), 'hex')),
(22, 'mesa_22_' || encode(gen_random_bytes(12), 'hex')),
(23, 'mesa_23_' || encode(gen_random_bytes(12), 'hex')),
(24, 'mesa_24_' || encode(gen_random_bytes(12), 'hex')),
(25, 'mesa_25_' || encode(gen_random_bytes(12), 'hex')),
(26, 'mesa_26_' || encode(gen_random_bytes(12), 'hex')),
(27, 'mesa_27_' || encode(gen_random_bytes(12), 'hex')),
(28, 'mesa_28_' || encode(gen_random_bytes(12), 'hex')),
(29, 'mesa_29_' || encode(gen_random_bytes(12), 'hex')),
(30, 'mesa_30_' || encode(gen_random_bytes(12), 'hex')),
(31, 'mesa_31_' || encode(gen_random_bytes(12), 'hex')),
(32, 'mesa_32_' || encode(gen_random_bytes(12), 'hex')),
(33, 'mesa_33_' || encode(gen_random_bytes(12), 'hex')),
(34, 'mesa_34_' || encode(gen_random_bytes(12), 'hex')),
(35, 'mesa_35_' || encode(gen_random_bytes(12), 'hex')),
(36, 'mesa_36_' || encode(gen_random_bytes(12), 'hex')),
(37, 'mesa_37_' || encode(gen_random_bytes(12), 'hex')),
(38, 'mesa_38_' || encode(gen_random_bytes(12), 'hex')),
(39, 'mesa_39_' || encode(gen_random_bytes(12), 'hex')),
(40, 'mesa_40_' || encode(gen_random_bytes(12), 'hex')),
(41, 'mesa_41_' || encode(gen_random_bytes(12), 'hex')),
(42, 'mesa_42_' || encode(gen_random_bytes(12), 'hex')),
(43, 'mesa_43_' || encode(gen_random_bytes(12), 'hex')),
(44, 'mesa_44_' || encode(gen_random_bytes(12), 'hex')),
(45, 'mesa_45_' || encode(gen_random_bytes(12), 'hex')),
(46, 'mesa_46_' || encode(gen_random_bytes(12), 'hex')),
(47, 'mesa_47_' || encode(gen_random_bytes(12), 'hex')),
(48, 'mesa_48_' || encode(gen_random_bytes(12), 'hex')),
(49, 'mesa_49_' || encode(gen_random_bytes(12), 'hex')),
(50, 'mesa_50_' || encode(gen_random_bytes(12), 'hex'))
ON CONFLICT (mesa_numero) DO NOTHING;

-- Índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_mesa_tokens_mesa_numero ON mesa_tokens(mesa_numero);
CREATE INDEX IF NOT EXISTS idx_mesa_tokens_token ON mesa_tokens(token);
CREATE INDEX IF NOT EXISTS idx_mesa_tokens_activo ON mesa_tokens(activo);

-- Función para actualizar updated_at
CREATE TRIGGER update_mesa_tokens_updated_at 
    BEFORE UPDATE ON mesa_tokens 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comentarios
COMMENT ON TABLE mesa_tokens IS 'Tokens únicos para acceso seguro a las mesas';
COMMENT ON COLUMN mesa_tokens.token IS 'Token único generado para acceder a la mesa via QR';
COMMENT ON COLUMN mesa_tokens.activo IS 'Si el token está activo o deshabilitado';
COMMENT ON COLUMN mesa_tokens.last_accessed IS 'Última vez que se accedió con este token';