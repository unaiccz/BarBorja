# 📸 Configuración de Supabase Storage para Imágenes de Productos

## ✅ El código ya está implementado. Solo necesitas configurar Supabase siguiendo estos pasos:

---

## 🔧 PASOS EN SUPABASE (5 minutos)

### 1️⃣ Acceder a Storage

1. Ve a tu proyecto en [https://supabase.com](https://supabase.com)
2. En el menú lateral izquierdo, haz clic en **"Storage"**

---

### 2️⃣ Crear el Bucket

1. Haz clic en el botón **"New bucket"** (o "Create a new bucket")
2. Rellena los campos:
   - **Name:** `product-images`
   - **Public bucket:** ✅ **MARCAR ESTA CASILLA** (importante)
   - **File size limit:** `5` MB (puedes ajustar si necesitas)
   - **Allowed MIME types:** `image/*`
3. Haz clic en **"Create bucket"**

---

### 3️⃣ Configurar Políticas de Seguridad (RLS)

Después de crear el bucket, verás el bucket `product-images` en la lista.

#### A) Permitir LECTURA PÚBLICA (para mostrar imágenes)

1. Haz clic en el bucket `product-images`
2. Ve a la pestaña **"Policies"**
3. Haz clic en **"New Policy"**
4. Selecciona **"For full customization"**
5. Rellena:
   - **Policy name:** `Public read access`
   - **Allowed operation:** Selecciona **`SELECT`**
   - **Policy definition (SQL):**
   ```sql
   true
   ```
   - **Target roles:** Deja el default o selecciona `public`
6. Haz clic en **"Review"** y luego **"Save policy"**

#### B) Permitir SUBIR imágenes (para usuarios autenticados)

1. Haz clic en **"New Policy"** de nuevo
2. Selecciona **"For full customization"**
3. Rellena:
   - **Policy name:** `Authenticated users can upload`
   - **Allowed operation:** Selecciona **`INSERT`**
   - **Policy definition (SQL):**
   ```sql
   true
   ```
   - **Target roles:** `authenticated`
4. Haz clic en **"Review"** y luego **"Save policy"**

#### C) Permitir ACTUALIZAR imágenes

1. Haz clic en **"New Policy"** de nuevo
2. Selecciona **"For full customization"**
3. Rellena:
   - **Policy name:** `Authenticated users can update`
   - **Allowed operation:** Selecciona **`UPDATE`**
   - **Policy definition (SQL):**
   ```sql
   true
   ```
   - **Target roles:** `authenticated`
4. Haz clic en **"Review"** y luego **"Save policy"**

#### D) Permitir ELIMINAR imágenes

1. Haz clic en **"New Policy"** de nuevo
2. Selecciona **"For full customization"**
3. Rellena:
   - **Policy name:** `Authenticated users can delete`
   - **Allowed operation:** Selecciona **`DELETE`**
   - **Policy definition (SQL):**
   ```sql
   true
   ```
   - **Target roles:** `authenticated`
4. Haz clic en **"Review"** y luego **"Save policy"**

---

## ✅ VERIFICACIÓN

Después de configurar todo, verifica:

1. En **Storage** → El bucket `product-images` debe aparecer con un icono de **"Public"**
2. En **Policies** del bucket, debes tener **4 políticas activas**:
   - ✅ Public read access (SELECT)
   - ✅ Authenticated users can upload (INSERT)
   - ✅ Authenticated users can update (UPDATE)
   - ✅ Authenticated users can delete (DELETE)

---

## 🎉 ¡LISTO! Ahora puedes usar el sistema

### Cómo usar en el Admin:

1. Ve al panel de Admin → Productos
2. Haz clic en **"Nuevo Producto"** o edita uno existente
3. En el campo **"Imagen del Producto"**, haz clic en **"Examinar"**
4. Selecciona una imagen de tu computadora
5. Verás una **vista previa** de la imagen
6. Rellena los demás campos y haz clic en **"Guardar"**
7. ✅ La imagen se sube automáticamente a Supabase Storage

### Qué hace automáticamente el sistema:

- 📤 **Sube la imagen** a `product-images/products/nombre-unico.jpg`
- 🔗 **Guarda la URL pública** en la base de datos
- 👁️ **Muestra vista previa** antes de guardar
- 🗑️ **Elimina la imagen anterior** si actualizas un producto con nueva imagen
- 🔒 **Genera nombres únicos** para evitar conflictos

---

## 🛠️ Solución de Problemas

### ❌ Error: "new row violates row-level security policy"
- **Causa:** Las políticas no están configuradas o el usuario no está autenticado
- **Solución:** Verifica que las 4 políticas estén activas y que estés logueado en el admin

### ❌ Las imágenes no se muestran
- **Causa:** El bucket no es público
- **Solución:** Edita el bucket y asegúrate de marcar **"Public bucket"**

### ❌ Error: "The resource already exists"
- **Causa:** (Raro) Conflicto de nombres
- **Solución:** Ya está solucionado, el sistema genera nombres únicos automáticamente

---

## 📊 Estructura de Almacenamiento

```
Supabase Storage
└── product-images (bucket público)
    └── products/
        ├── 1699012345678-abc123def456.jpg
        ├── 1699012346789-def789ghi012.png
        └── 1699012347890-ghi345jkl678.webp
```

---

## 🔥 Características Implementadas

✅ Subida de archivos directa (no URLs)
✅ Vista previa en tiempo real
✅ Nombres únicos automáticos (timestamp + random)
✅ Eliminación automática de imágenes antiguas
✅ Soporte para múltiples formatos (JPG, PNG, WebP, GIF, etc.)
✅ Validación de tipo de archivo
✅ URLs públicas accesibles globalmente
✅ Caché de 1 hora para mejor rendimiento

---

**¡Eso es todo! Sigue estos pasos en Supabase y el sistema estará completamente funcional.** 🚀
