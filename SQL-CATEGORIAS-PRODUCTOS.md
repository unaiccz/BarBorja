# 🗄️ SQL Completo para Categorías y Productos

## 📋 PASO 1: Crear la tabla de Categorías

Copia y ejecuta este SQL en Supabase SQL Editor:

```sql
-- ============================================
-- CREAR TABLA DE CATEGORÍAS
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
```

---

## 🔗 PASO 2: Agregar columna de categoría a productos

Si tu tabla `products` NO tiene la columna `category_id`, ejecuta:

```sql
-- ============================================
-- MODIFICAR TABLA PRODUCTS - Agregar categoría
-- ============================================

-- Agregar columna category_id (foreign key)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES categories(id) ON DELETE SET NULL;

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- Actualizar productos existentes (asignar a la primera categoría)
UPDATE products 
SET category_id = (SELECT id FROM categories ORDER BY "order" LIMIT 1)
WHERE category_id IS NULL;

-- (OPCIONAL) Si quieres que category_id sea NOT NULL:
-- ALTER TABLE products 
-- ALTER COLUMN category_id SET NOT NULL;
```

---

## 🎯 PASO 3: Vista completa con categorías (OPCIONAL - para consultas rápidas)

Si quieres una vista que combine productos con categorías:

```sql
-- ============================================
-- CREAR VISTA DE PRODUCTOS CON CATEGORÍAS
-- ============================================

CREATE OR REPLACE VIEW products_with_categories AS
SELECT 
    p.product_id,
    p.name as product_name,
    p.description,
    p.price,
    p.stock,
    p.type,
    p.ingredients,
    p.allergens,
    p.image_url,
    p.category_id,
    c.name as category_name,
    c.icon as category_icon,
    c."order" as category_order,
    p.created_at,
    p.updated_at
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
ORDER BY c."order" ASC, p.name ASC;
```

---

## 📊 ESTRUCTURA FINAL

### Tabla `categories`:
```
id           | uuid    | Clave primaria
name         | varchar | Nombre único (Bebidas, Entrantes, etc)
icon         | varchar | Emoji 🍷 🥗 🍕
description  | text    | Descripción opcional
order        | integer | Orden de visualización (1, 2, 3...)
created_at   | timestamp
updated_at   | timestamp
```

### Cambios en tabla `products`:
```
[Columnas existentes...]
category_id  | uuid    | Foreign key → categories(id) [NUEVA]
```

---

## ✅ VERIFICACIÓN

Después de ejecutar el SQL, verifica:

```sql
-- Ver categorías creadas
SELECT * FROM categories ORDER BY "order";

-- Ver productos con categorías
SELECT 
    p.product_id,
    p.name,
    c.name as category,
    c.icon
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
ORDER BY c."order", p.name;

-- Ver estructura de products
\d products;
```

---

## 🔄 ORDEN DE EJECUCIÓN RECOMENDADO

1. **Primero:** Copia todo el SQL de PASO 1 y ejecuta
2. **Espera:** Confirma que se ejecutó correctamente ✅
3. **Luego:** Copia el SQL de PASO 2 y ejecuta
4. **Opcional:** Ejecuta el SQL de PASO 3 si quieres la vista

---

## 🚨 SI TIENES ERRORES

### Error: "column category_id already exists"
- La columna ya existe, puedes saltar el PASO 2

### Error: "table products doesn't exist"
- Asegúrate de que el nombre correcto es `products` (no `product`)

### Error: "categories already exists"
- Es normal si ejecutas dos veces. Solo ejecuta una vez.

### Error: "duplicate key value violates unique constraint"
- Ya existen categorías con ese nombre, usa `ON CONFLICT DO NOTHING` (ya incluido)

---

## 💡 TIPS

- Las categorías se ordenan por el campo `order` (1, 2, 3...)
- El `icon` debe ser UN SOLO emoji (ej: 🍷, no "bebida")
- El `name` debe ser único (no puede haber dos "Bebidas")
- Puedes agregar más categorías desde el admin sin SQL

---

## 🎉 ¡LISTO!

Una vez ejecutado el SQL:
- ✅ Puedes crear/editar categorías desde el admin
- ✅ Los productos pueden asignarse a categorías
- ✅ La visualización será mejorada (próximo paso)
