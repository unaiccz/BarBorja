# Configuración de Supabase Storage para Imágenes de Productos

## 📋 Pasos a realizar en Supabase

### 1️⃣ Crear el Bucket de Storage

1. **Acceder a tu proyecto de Supabase**
   - Ve a [https://supabase.com](https://supabase.com)
   - Selecciona tu proyecto BarBorja

2. **Ir a Storage**
   - En el menú lateral, haz clic en **"Storage"**

3. **Crear nuevo bucket**
   - Haz clic en **"New bucket"** o **"Create a new bucket"**
   - Configura el bucket con los siguientes datos:
     - **Name**: `product-images`
     - **Public bucket**: ✅ **SÍ** (marca el checkbox)
     - **File size limit**: `5 MB` (o el tamaño que prefieras)
     - **Allowed MIME types**: `image/*` (permite todos los tipos de imagen)
   - Haz clic en **"Create bucket"**

### 2️⃣ Configurar las Políticas de Seguridad (RLS)

Una vez creado el bucket, necesitas configurar las políticas para permitir:
- Lectura pública (para mostrar las imágenes)
- Escritura solo para usuarios autenticados (para subir/actualizar imágenes)

#### Política para LECTURA PÚBLICA (SELECT):

1. En el bucket `product-images`, ve a **"Policies"**
2. Haz clic en **"New Policy"** → **"For full customization"**
3. Configura:
   - **Policy name**: `Public read access`
   - **Allowed operation**: `SELECT`
   - **Target roles**: `public` (o marca "Provide access to public")
   - **Policy definition**:
   ```sql
   true
   ```
4. Guarda la política

#### Política para SUBIDA DE ARCHIVOS (INSERT):

1. Haz clic en **"New Policy"** → **"For full customization"**
2. Configura:
   - **Policy name**: `Authenticated users can upload`
   - **Allowed operation**: `INSERT`
   - **Target roles**: `authenticated`
   - **Policy definition**:
   ```sql
   true
   ```
3. Guarda la política

#### Política para ACTUALIZAR ARCHIVOS (UPDATE):

1. Haz clic en **"New Policy"** → **"For full customization"**
2. Configura:
   - **Policy name**: `Authenticated users can update`
   - **Allowed operation**: `UPDATE`
   - **Target roles**: `authenticated`
   - **Policy definition**:
   ```sql
   true
   ```
3. Guarda la política

#### Política para ELIMINAR ARCHIVOS (DELETE):

1. Haz clic en **"New Policy"** → **"For full customization"**
2. Configura:
   - **Policy name**: `Authenticated users can delete`
   - **Allowed operation**: `DELETE`
   - **Target roles**: `authenticated`
   - **Policy definition**:
   ```sql
   true
   ```
3. Guarda la política

### 3️⃣ Verificar la Configuración

1. **Verifica que el bucket sea público**:
   - En la lista de buckets, verifica que `product-images` tenga el icono de **"Public"**
   - Si no lo es, edita el bucket y marca "Public bucket"

2. **Estructura de carpetas**:
   - El sistema creará automáticamente la carpeta `products/` dentro del bucket
   - Las imágenes se guardarán como: `products/timestamp-random.ext`

### 4️⃣ Probar la Funcionalidad

1. **En el admin de tu aplicación**:
   - Ve a la sección de Productos
   - Haz clic en "Nuevo Producto" o edita uno existente
   - Selecciona una imagen usando el botón "Examinar"
   - Verás una vista previa de la imagen
   - Guarda el producto
   - La imagen se subirá automáticamente a Supabase Storage

2. **Verificar en Supabase**:
   - Ve a Storage → `product-images` → carpeta `products`
   - Deberías ver las imágenes subidas con nombres únicos

## 🔧 Configuración Técnica Implementada

### En el código (ya implementado):

```javascript
// Subida de imagen
const { data: uploadData, error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, imageFile, {
        cacheControl: '3600',
        upsert: false
    });

// Obtener URL pública
const { data: urlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

// Eliminar imagen anterior al actualizar
await supabase.storage
    .from('product-images')
    .remove([oldPath]);
```

## 📝 Notas Importantes

1. **Nombres de archivo únicos**: El sistema genera nombres únicos usando `timestamp + random`
2. **Formatos soportados**: JPG, PNG, WebP, GIF, SVG
3. **Tamaño máximo**: Configurable en el bucket (recomendado 5-10 MB)
4. **Eliminación automática**: Al actualizar un producto con nueva imagen, se elimina la anterior
5. **Vista previa**: Se muestra antes de guardar
6. **Caché**: Las imágenes se cachean por 1 hora (3600 segundos)

## ⚠️ Solución de Problemas

### Error: "The resource already exists"
- El archivo ya existe con ese nombre
- Solución: Ya implementado con nombres únicos

### Error: "Row Level Security policy violation"
- Las políticas no están configuradas correctamente
- Solución: Verifica que las políticas estén activas y configuradas como se indica arriba

### Error: "new row violates row-level security policy"
- El usuario no está autenticado
- Solución: Asegúrate de estar logueado en el admin

### Las imágenes no se muestran
- El bucket no es público
- Solución: Edita el bucket y marca "Public bucket"

## 🎉 Resultado Final

Una vez completada la configuración:
- ✅ Los administradores pueden subir imágenes directamente
- ✅ Las imágenes se almacenan en Supabase Storage
- ✅ Las imágenes son accesibles públicamente
- ✅ Al actualizar productos, las imágenes antiguas se eliminan automáticamente
- ✅ Vista previa de imágenes antes de guardar
- ✅ Soporte para múltiples formatos de imagen
