# 📱 Sistema de Acceso por QR - Mesas

## 🎯 Resumen

Cada mesa del restaurante tiene un **token único** que permite el acceso directo al menú digital. Los clientes escanean el código QR de su mesa y acceden automáticamente.

## 🔗 Estructura de URLs

### URL de Acceso
```
http://tu-dominio.com/mesa/access?token=XXXXXXXX
```

**Ejemplo:**
```
http://localhost:4321/mesa/access?token=mesa_1_6f0886188ba993bae72dd4d3
```

## 📋 Cómo Obtener las URLs

### Opción 1: Script de Terminal (Recomendado)

Ejecuta el siguiente comando para obtener TODAS las URLs:

```bash
node get-mesa-urls.cjs
```

Esto mostrará:
- ✅ Todas las URLs de las 50 mesas
- 📝 Instrucciones para generar QR
- ⚠️ Recordatorio para cambiar el dominio en producción

### Opción 2: Página de Desarrollo

Accede a: `http://localhost:4321/dev-mesas`

Esta página muestra:
- Lista de todas las mesas con sus tokens
- Botón para copiar cada URL
- Acceso directo a cada mesa

### Opción 3: Panel de Administración

Accede a: `http://localhost:4321/admin/mesas-qr`

Aquí puedes:
- Ver todas las mesas y sus tokens
- Generar códigos QR automáticamente
- Descargar los QR para imprimir

## 🖨️ Generar Códigos QR

### Método 1: Online (Manual)

1. Copia la URL de una mesa
2. Ve a un generador de QR:
   - [QR Code Generator](https://www.qr-code-generator.com/)
   - [QR Code Monkey](https://www.qrcode-monkey.com/)
   - [QR Tiger](https://www.qrcode-tiger.com/)
3. Pega la URL
4. Genera y descarga el QR
5. Imprime y coloca en la mesa

### Método 2: Panel Admin (Automático)

1. Ve a `/admin/mesas-qr`
2. Haz clic en "Generar QR" para cada mesa
3. Descarga todos los QR
4. Imprime y distribuye

## 🗄️ Base de Datos

### Tabla: `mesa_tokens`

```sql
CREATE TABLE mesa_tokens (
    id UUID PRIMARY KEY,
    mesa_numero INTEGER UNIQUE NOT NULL,
    token TEXT UNIQUE NOT NULL,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Campos:
- `mesa_numero`: Número de la mesa (1-50)
- `token`: Token único generado (formato: `mesa_X_HASH`)
- `activo`: Si el token está activo o no
- `created_at`: Fecha de creación

## 🔄 Flujo de Acceso

1. **Cliente escanea QR** → URL con token
2. **Sistema valida token** → Verifica en `mesa_tokens`
3. **Redirección** → `/mesa-temp?numero=X`
4. **Menú cargado** → Cliente puede hacer pedidos

## ⚙️ Configuración en Producción

### 1. Cambiar el Dominio

Edita `get-mesa-urls.cjs`:

```javascript
// Cambiar esta línea:
const baseUrl = 'http://localhost:4321';

// Por tu dominio real:
const baseUrl = 'https://tu-restaurante.com';
```

### 2. Regenerar URLs

```bash
node get-mesa-urls.cjs
```

### 3. Generar Nuevos QR

Usa las nuevas URLs para generar los códigos QR finales.

## 🛠️ Scripts Disponibles

### `get-mesa-urls.cjs`
Obtiene todas las URLs con tokens para generar QR.

```bash
node get-mesa-urls.cjs
```

### `check-tokens.cjs`
Verifica que los tokens existan en la base de datos.

```bash
node check-tokens.cjs
```

## 📱 Páginas del Sistema

| Ruta | Descripción |
|------|-------------|
| `/mesa/access?token=XXX` | Acceso con token (QR) |
| `/mesa-temp?numero=X` | Menú de la mesa |
| `/dev-mesas` | Desarrollo: Lista de mesas |
| `/admin/mesas-qr` | Admin: Gestión de QR |

## 🔒 Seguridad

- ✅ Cada token es único e irrepetible
- ✅ Los tokens se validan en cada acceso
- ✅ Se puede desactivar un token sin eliminarlo
- ✅ Los tokens no expiran (a menos que se desactiven)

## 📝 Notas Importantes

1. **No compartas los tokens públicamente** - Son únicos por mesa
2. **Guarda una copia de los QR** - Por si necesitas reimprimirlos
3. **Prueba los QR antes de imprimir** - Verifica que funcionen
4. **Usa URLs HTTPS en producción** - Para mayor seguridad

## 🆘 Solución de Problemas

### Error: "Sin token"
- Verifica que la URL incluya `?token=XXX`
- Comprueba que el token exista en la base de datos

### QR no funciona
- Verifica que la URL sea correcta
- Prueba escaneando con diferentes apps
- Asegúrate de que el dominio sea accesible

### Token no válido
- Ejecuta `node check-tokens.cjs` para verificar
- Revisa que el token esté activo en la base de datos

## 📞 Contacto

Para más información o soporte, consulta la documentación del proyecto.
