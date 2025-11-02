-- ============================================
-- SQL COMPLETO PARA CATEGORÍAS
-- ============================================

-- PASO 1: LIMPIAR SI EXISTE (opcional - descomenta si necesitas empezar de cero)
-- DROP TABLE IF EXISTS categories CASCADE;

-- PASO 2: CREAR TABLA DE CATEGORÍAS
CREATE TABLE IF NOT EXISTS categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name varchar NOT NULL UNIQUE,
    icon varchar(10) NOT NULL,
    description text,
    "order" integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories("order");
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- PASO 3: HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- PASO 4: CREAR POLÍTICAS DE SEGURIDAD
-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Public can view categories" ON categories;
DROP POLICY IF EXISTS "Admin can create categories" ON categories;
DROP POLICY IF EXISTS "Admin can update categories" ON categories;
DROP POLICY IF EXISTS "Admin can delete categories" ON categories;

-- Crear nuevas políticas
CREATE POLICY "Public can view categories" ON categories
FOR SELECT USING (true);

CREATE POLICY "Admin can create categories" ON categories
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can update categories" ON categories
FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Admin can delete categories" ON categories
FOR DELETE USING (true);

-- PASO 5: AGREGAR COLUMNA A PRODUCTS (si no existe)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES categories(id) ON DELETE SET NULL;

-- Crear índice en products
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- PASO 6: INSERTAR CATEGORÍAS INICIALES
-- Limpiar categorías existentes (opcional - descomenta si necesitas)
-- DELETE FROM categories;

-- Insertar nuevas categorías
INSERT INTO categories (name, icon, description, "order") VALUES
    ('Bebidas', '🍷', 'Bebidas variadas', 1),
    ('Entrantes', '🥗', 'Platos para empezar', 2),
    ('Pizzas', '🍕', 'Pizzas artesanales', 3),
    ('Hamburguesas', '🍔', 'Hamburguesas gourmet', 4),
    ('Pastas', '🍝', 'Pastas italianas', 5),
    ('Platos Principales', '🥘', 'Platos fuertes', 6),
    ('Postres', '🍰', 'Dulces y postres', 7)
ON CONFLICT (name) DO NOTHING;

-- PASO 7: ASIGNAR CATEGORÍAS A PRODUCTOS EXISTENTES (si no tienen)
UPDATE products 
SET category_id = (SELECT id FROM categories WHERE name = 'Platos Principales' ORDER BY "order" LIMIT 1)
WHERE category_id IS NULL;

-- ============================================
-- VERIFICACIÓN - EJECUTA ESTAS CONSULTAS PARA CONFIRMAR
-- ============================================

-- Ver todas las categorías
SELECT 
    id,
    name,
    icon,
    description,
    "order",
    created_at
FROM categories 
ORDER BY "order" ASC;

-- Ver cuántos productos hay por categoría
SELECT 
    c.name,
    c.icon,
    COUNT(p.product_id) as total_productos
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name, c.icon
ORDER BY c."order" ASC;

-- Ver productos con sus categorías
SELECT 
    p.product_id,
    p.name,
    p.price,
    p.stock,
    c.name as categoria,
    c.icon
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
ORDER BY c."order" ASC, p.name ASC
LIMIT 20;

-- ============================================
-- OTRAS CONSULTAS ÚTILES
-- ============================================

-- Actualizar el orden de una categoría
-- UPDATE categories SET "order" = 5 WHERE name = 'Bebidas';

-- Agregar una nueva categoría
-- INSERT INTO categories (name, icon, description, "order") 
-- VALUES ('Nueva Categoría', '🎯', 'Descripción', 8);

-- Eliminar una categoría (los productos quedarán sin categoría)
-- DELETE FROM categories WHERE name = 'Nueva Categoría';

-- Renombrar una categoría
-- UPDATE categories SET name = 'Nuevo Nombre' WHERE name = 'Nombre Viejo';
