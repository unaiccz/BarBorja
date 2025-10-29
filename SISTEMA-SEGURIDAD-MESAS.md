# Sistema de Acceso Seguro por QR - Mesas

## Resumen del Problema Solucionado

**Problema original:** Las páginas de mesa eran accesibles públicamente mediante URLs como `/mesa/1`, `/mesa/2`, etc., lo que permitía el acceso no autorizado.

**Solución implementada:** Sistema de tokens únicos por mesa con acceso vía códigos QR.

---

## ⚙️ Funcionamiento del Sistema

### 1. **Base de Datos**
- Nueva tabla: `mesa_tokens`
- Cada mesa tiene un token único generado aleatoriamente
- Tokens pueden activarse/desactivarse
- Se registra el último acceso

### 2. **URLs Seguras**
- **Antes:** `/mesa/1` (público)
- **Ahora:** `/mesa/secure?token=mesa_1_abc123def456...` (privado)

### 3. **Flujo de Acceso**
1. Cliente escanea QR de la mesa
2. QR contiene URL con token único
3. Sistema verifica token en base de datos
4. Si es válido y activo → acceso permitido
5. Si no es válido → redirección a inicio

---

## 📱 Administración de QR

### Panel de Control: `/admin/mesas-qr`

**Funcionalidades disponibles:**
- ✅ Ver todos los tokens de mesas (1-50)
- ✅ Generar códigos QR individuales o masivos
- ✅ Regenerar tokens individuales o masivos
- ✅ Activar/desactivar acceso por mesa
- ✅ Copiar URLs y tokens al portapapeles
- ✅ Descargar QR como imagen PNG
- ✅ Imprimir QR con información de mesa
- ✅ Ver último acceso a cada mesa

---

## 🗄️ Migración de Base de Datos

**Archivo:** `/migrations/create_mesa_tokens.sql`

```sql
-- Ejecutar en Supabase SQL Editor:
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
-- ... (continúa hasta mesa 50)
```

---

## 🔧 Archivos Modificados/Creados

### Nuevos Archivos:
1. **`/src/pages/mesa/secure.astro`** - Página segura de mesa
2. **`/src/pages/payment/mesa-secure.astro`** - Página segura de pago
3. **`/src/pages/admin/mesas-qr.astro`** - Panel de gestión QR
4. **`/migrations/create_mesa_tokens.sql`** - Migración de BD

### Archivos Modificados:
1. **`/src/pages/admin/index.astro`** - Añadida pestaña "QR Mesas"

---

## 🚀 Implementación - Pasos a Seguir

### 1. **Ejecutar Migración**
```sql
-- En Supabase SQL Editor, ejecutar:
-- El contenido completo de /migrations/create_mesa_tokens.sql
```

### 2. **Generar QRs**
1. Ir a `/admin/mesas-qr`
2. Hacer clic en "Generar Todos los QR"
3. Descargar e imprimir los QRs necesarios

### 3. **Reemplazar QRs Físicos**
- Colocar nuevos QRs en cada mesa
- Los QRs antiguos (si existen) dejarán de funcionar
- Cada QR ahora redirige a `/mesa/secure?token=...`

### 4. **Verificar Funcionamiento**
1. Escanear QR de una mesa
2. Verificar acceso a carta
3. Realizar pedido de prueba
4. Verificar acceso a pago seguro

---

## 🔒 Características de Seguridad

### ✅ **Ventajas del Nuevo Sistema:**
- **Acceso controlado:** Solo mediante QR oficial
- **Tokens únicos:** Cada mesa tiene su propio código
- **Activación/desactivación:** Control granular por mesa
- **Registro de acceso:** Auditoría de uso
- **Regeneración fácil:** Tokens comprometidos se renuevan
- **URLs no adivinables:** Tokens aleatorios largos

### ⚠️ **Consideraciones:**
- **QRs físicos:** Deben protegerse de manipulación
- **Regeneración masiva:** Invalidará todos los QRs actuales
- **Backup:** Mantener respaldo de tokens activos

---

## 🛠️ Mantenimiento

### Operaciones Comunes:

**Regenerar token de mesa específica:**
1. Ir a `/admin/mesas-qr`
2. Buscar la mesa
3. Clic en "🔄 Nuevo Token"
4. Generar nuevo QR
5. Reemplazar QR físico

**Desactivar mesa temporalmente:**
1. Ir a `/admin/mesas-qr`
2. Buscar la mesa
3. Clic en "🚫 Desactivar"
4. El QR dejará de funcionar hasta reactivación

**Regeneración masiva (emergencia):**
1. Ir a `/admin/mesas-qr`
2. Clic en "🔄 Regenerar Todos los Tokens"
3. ⚠️ TODOS los QRs actuales dejarán de funcionar
4. Generar todos los QRs nuevamente
5. Reemplazar físicamente TODOS los QRs

---

## 📊 Monitoreo

### Información Disponible:
- ✅ Estado de cada token (activo/inactivo)
- ✅ Fecha de creación de tokens
- ✅ Última fecha de acceso por mesa
- ✅ URLs completas de acceso

### Indicadores de Uso:
- Mesas con accesos recientes
- Mesas nunca accedidas
- Tokens inactivos

---

## 🚨 Solución de Problemas

### **QR no funciona:**
1. Verificar que el token está activo
2. Comprobar que la URL es correcta
3. Regenerar token si es necesario

### **Error de acceso:**
1. Verificar conexión a base de datos
2. Comprobar que la tabla `mesa_tokens` existe
3. Verificar que el token existe en la BD

### **Mesa no encontrada:**
1. Verificar que el número de mesa está en rango (1-50)
2. Comprobar que existe registro en `mesa_tokens`
3. Verificar que el token coincide con la mesa

---

## ✅ Resultado Final

**Sistema completamente seguro:**
- ❌ URLs públicas como `/mesa/1`
- ✅ URLs privadas con tokens únicos
- ✅ Control total sobre acceso a mesas
- ✅ Trazabilidad de uso
- ✅ Fácil gestión administrativa
- ✅ Compatibilidad con sistema de pago existente

El acceso a las cartas de mesa ahora es **completamente privado y controlado**, solucionando el problema de acceso público no deseado.