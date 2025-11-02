# 📋 Crear Tabla de Categorías en Supabase

## Pasos para crear la tabla `categories`:

### 1. Ve a Supabase SQL Editor

1. Accede a tu proyecto en [https://supabase.com](https://supabase.com)
2. Ve a **SQL Editor** en el menú lateral izquierdo
3. Haz clic en **"New query"**

### 2. Ejecuta el siguiente SQL:

```sql
-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name varchar NOT NULL,
    icon varchar(10) NOT NULL,
    description text,
    "order" integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crear índice para orden
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories("order");

-- Habilitar Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Crear política para lectura pública
CREATE POLICY "Public can view categories" ON categories
FOR SELECT USING (true);

-- Crear política para admin (INSERT)
CREATE POLICY "Admin can create categories" ON categories
FOR INSERT WITH CHECK (true);

-- Crear política para admin (UPDATE)
CREATE POLICY "Admin can update categories" ON categories
FOR UPDATE USING (true) WITH CHECK (true);

-- Crear política para admin (DELETE)
CREATE POLICY "Admin can delete categories" ON categories
FOR DELETE USING (true);
```

### 3. Ejecutar la query

1. Haz clic en **"Run"** o presiona **Ctrl+Enter**
2. Deberías ver un mensaje confirmando que la tabla fue creada ✅

### 4. Verificar la tabla

1. Ve a **Table Editor** en el menú lateral
2. Busca la tabla `categories` en la lista
3. Deberías verla con las columnas: `id`, `name`, `icon`, `description`, `order`, `created_at`, `updated_at`

---

## 📝 Estructura de la tabla:

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | UUID | ID único (clave primaria) |
| `name` | VARCHAR | Nombre de la categoría (ej: "Bebidas", "Entrantes") |
| `icon` | VARCHAR(10) | Emoji o icono (ej: "🍷", "🥗") |
| `description` | TEXT | Descripción opcional de la categoría |
| `order` | INTEGER | Orden de visualización (1, 2, 3...) |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de última actualización |

---

## 🎉 ¡Listo!

Ahora podrás:
- ✅ Crear nuevas categorías desde el admin
- ✅ Editar categorías existentes
- ✅ Eliminar categorías
- ✅ Organizar por orden de visualización
- ✅ Usar los íconos/emojis en la visualización de productos

---

## 💡 Ejemplos de categorías que puedes crear:

- 🍷 Bebidas
- 🥗 Entrantes
- 🍕 Pizzas
- 🍔 Hamburguesas
- 🍝 Pastas
- 🥘 Platos Principales
- 🍰 Postres
- ☕ Café
- 🍻 Cervezas
- 🌮 Tacos
