-- ============================================
-- PASO 1: CREAR TABLA DE CATEGORÍAS
-- ============================================

CREATE TABLE IF NOT EXISTS categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name varchar NOT NULL UNIQUE,
    icon varchar(10) NOT NULL,
    description text,
    "order" integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crear índice para ordenamiento
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories("order");
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Habilitar Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad
CREATE POLICY "Public can view categories" ON categories
FOR SELECT USING (true);

CREATE POLICY "Admin can create categories" ON categories
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can update categories" ON categories
FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Admin can delete categories" ON categories
FOR DELETE USING (true);

-- Insertar categorías de ejemplo (opcional)
INSERT INTO categories (name, icon, description, "order") VALUES
    ('Bebidas', '🍷', 'Bebidas variadas', 1),
    ('Entrantes', '🥗', 'Platos para empezar', 2),
    ('Pizzas', '🍕', 'Pizzas artesanales', 3),
    ('Hamburguesas', '🍔', 'Hamburguesas gourmet', 4),
    ('Pastas', '🍝', 'Pastas italianas', 5),
    ('Platos Principales', '🥘', 'Platos fuertes', 6),
    ('Postres', '🍰', 'Dulces y postres', 7)
ON CONFLICT DO NOTHING;

-- ============================================
-- PASO 2: MODIFICAR TABLA PRODUCTS - Agregar categoría
-- ============================================

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES categories(id) ON DELETE SET NULL;

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- Actualizar productos existentes (asignar a la primera categoría)
UPDATE products 
SET category_id = (SELECT id FROM categories ORDER BY "order" LIMIT 1)
WHERE category_id IS NULL;

-- ============================================
-- PASO 3: VERIFICACIÓN (Ejecuta estas consultas para verificar)
-- ============================================

-- Ver categorías creadas
SELECT * FROM categories ORDER BY "order";

-- Ver productos con categorías
SELECT 
    product_id,
    name,
    price,
    stock,
    category_id
FROM products
LIMIT 10;
