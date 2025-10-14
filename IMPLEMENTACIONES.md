npm run dev# 🎉 Implementaciones Completadas - BarBorja

## ✅ 1. Sistema de Autenticación para Admin

### Implementado:
- **Página de login**: `/admin/login`
- **Contraseña**: `secretpassword`
- **Protección**: La página `/admin` ahora requiere autenticación
- **Botón de logout**: En la esquina superior derecha del panel admin

### Cómo usar:
1. Intenta acceder a `/admin`
2. Serás redirigido a `/admin/login`
3. Ingresa la contraseña: `secretpassword`
4. Accederás al panel de administración
5. Para cerrar sesión, haz clic en "Cerrar Sesión"

---

## ✅ 2. Sistema de Pagos con Tickets

### Implementado:
- **Página de pago**: `/payment/mesa-[numero]`
- **Dos métodos de pago**:
  - 💳 **Pago con Tarjeta** (Stripe - **Integración Real**)
  - 🍺 **Pago en Barra** (efectivo/tarjeta en caja)
- **Stripe Elements**: Formulario de pago real con validación
- **API de pago**: Endpoint `/api/create-payment-intent` para procesar pagos
- **Ticket imprimible**: Se genera automáticamente después del pago
- **Funcionalidad de impresión**: Botón "🖨️ Imprimir Ticket"
- **Botón de pago**: Aparece automáticamente cuando **TODOS** los pedidos de la mesa estén entregados
- **Pago consolidado**: Paga todos los pedidos de la mesa en una sola transacción

### Configuración de Stripe:

1. **Obtén tus claves de Stripe:**
   - Crea cuenta en [stripe.com](https://stripe.com)
   - Ve a Dashboard → Developers → API keys
   - Copia tu **Publishable key** (`pk_test_...`)
   - Copia tu **Secret key** (`sk_test_...`)

2. **Configura las variables de entorno:**
   - Copia `.env.example` a `.env`
   - Agrega tus claves:
   ```bash
   STRIPE_SECRET_KEY=sk_test_tu_clave_aqui
   PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_aqui
   ```

3. **Reinicia el servidor:**
   ```bash
   npm run dev
   ```

📖 **Guía completa:** Ver `CONFIGURACION-STRIPE.md`

### Cómo funciona:
1. El cliente hace uno o más pedidos desde su mesa
2. El admin procesa cada pedido: Pendiente → Preparando → Listo → **Entregado**
3. Cuando **TODOS** los pedidos de la mesa estén en estado "Entregado":
   - Aparece una sección especial en el historial de pedidos
   - Muestra "✅ Todos los pedidos entregados"
   - Muestra el total consolidado de todos los pedidos
   - Aparece un botón grande "💳 Proceder al Pago"
4. Al hacer clic, se abre la página de pago con:
   - Resumen de todos los pedidos entregados
   - Total acumulado
   - Opciones de pago (Tarjeta o Barra)
5. Después de elegir método de pago:
   - Se genera un ticket con todos los pedidos
   - Incluye cada pedido por separado
   - Muestra el total final
   - Botón para imprimir

### Ejemplo de flujo:
```
Mesa 5 hace 3 pedidos:
- Pedido #10: 2 cervezas (8€) → Entregado ✅
- Pedido #12: 1 hamburguesa (12€) → Entregado ✅  
- Pedido #15: 2 postres (10€) → Entregado ✅

→ Aparece botón "💳 Proceder al Pago"
→ Total a pagar: 30€
→ Cliente paga todo junto
→ Ticket incluye los 3 pedidos
```

---

## ✅ 3. Imágenes en Productos

### Implementado:
- **Campo de imagen** en el formulario de productos (admin)
- **Visualización**: Las imágenes se muestran en:
  - Panel de administración (tarjetas de productos)
  - Carta de la mesa (productos disponibles)
- **Campo opcional**: Si no se proporciona URL, el producto se muestra sin imagen

### Configuración necesaria en Supabase:

1. **Agregar columna a la base de datos**:
   - Ve a Supabase SQL Editor
   - Ejecuta el script en `database/add-image-column.sql`:
```sql
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
```

2. **Usar imágenes**:
   - Al crear/editar un producto en `/admin`, ingresa la URL de la imagen
   - Puedes usar servicios como:
     - Imgur: https://imgur.com
     - Cloudinary: https://cloudinary.com
     - Supabase Storage (recomendado)

### Ejemplo de URLs de imágenes:
- `https://i.imgur.com/ejemplo.jpg`
- `https://res.cloudinary.com/tu-cuenta/image/upload/producto.jpg`
- URLs directas de imágenes públicas

---

## 📦 Instalación de Dependencias

Las dependencias ya están en package.json, solo ejecuta:

```bash
npm install
```

Dependencias agregadas:
- `@stripe/stripe-js`: Cliente de Stripe para JavaScript
- `stripe`: SDK de Stripe para el servidor

---

## 🚀 Pasos para Probar Todo

### 0. **Configurar Stripe (NUEVO):**
```bash
# 1. Crea cuenta en stripe.com
# 2. Obtén tus claves API (pk_test_ y sk_test_)
# 3. Copia .env.example a .env
cp .env.example .env

# 4. Edita .env y agrega tus claves de Stripe
STRIPE_SECRET_KEY=sk_test_tu_clave
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave

# 5. Ver guía completa en CONFIGURACION-STRIPE.md
```

### 1. Configurar la base de datos:
```bash
# En Supabase SQL Editor, ejecuta:
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
```

### 2. Instalar dependencias:
```bash
npm install
```

### 3. Ejecutar el servidor:
```bash
npm run dev
```

### 4. Probar autenticación:
- Ve a `http://localhost:4321/admin`
- Ingresa contraseña: `secretpassword`
- Deberías acceder al panel

### 5. Probar productos con imágenes:
- En `/admin`, crea un producto nuevo
- Agrega una URL de imagen (ejemplo: `https://i.imgur.com/ejemplo.jpg`)
- Verifica que se muestre en:
  - Lista de productos en admin
  - Carta en `/mesa/1`

### 6. Probar flujo completo de pago:
```
1. Mesa 1 → Agregar productos al carrito → Realizar Pedido
2. (Opcional) Mesa 1 → Hacer más pedidos
3. Admin → Ver pedidos en "Pendientes" → Marcar como "Preparando" → Marcar como "Listo" → Marcar como "Entregado"
4. Repetir paso 3 para TODOS los pedidos de la mesa
5. Mesa 1 → Cuando TODOS estén "Entregados", aparecerá:
   - "✅ Todos los pedidos entregados"
   - "Total a pagar: XX.XX€"
   - Botón grande "💳 Proceder al Pago"
6. Clic en "Proceder al Pago"
7. Ver resumen de todos los pedidos
8. Elegir método de pago (Tarjeta o Barra)
9. Ver ticket consolidado → Imprimir
```

---

## 🎨 Características Visuales

### Botón de pago consolidado:
- ✅ Solo aparece cuando **TODOS** los pedidos están "Entregados"
- 🚫 Los pedidos cancelados no se cuentan
- 💰 Muestra el total acumulado de todos los pedidos entregados
- 🎯 Sección destacada con fondo verde y bordes especiales
- 📊 Resumen claro: "Todos los pedidos entregados"
- 🔘 Botón grande y prominente para proceder al pago

### Productos con imágenes:
- Imagen de 180px de alto
- Efecto hover con zoom
- Bordes redondeados elegantes
- Fallback si la imagen no carga

### Botón de pago:
- Aparece solo cuando el pedido está "Listo"
- Color verde distintivo
- Animación al hover
- Icono de tarjeta 💳

### Página de pago:
- Diseño limpio y profesional
- Resumen del pedido visible
- Dos opciones claras de pago
- Ticket estilizado con tipografía monospace

---

## 🔐 Seguridad

### Contraseña Admin:
- **Actual**: `secretpassword` (hardcoded)
- **Ubicación**: `src/pages/admin/login.astro` línea 169
- **Para cambiar**: Edita la constante `ADMIN_PASSWORD`

### Recomendación para producción:
```javascript
// Usar variable de entorno
const ADMIN_PASSWORD = import.meta.env.ADMIN_PASSWORD || 'secretpassword';
```

---

## 📝 Base de Datos

### Estructura actualizada de `products`:
```sql
CREATE TABLE products (
  product_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  type TEXT CHECK (type IN ('cocina', 'barra')),
  ingredients TEXT,
  allergens TEXT,
  image_url TEXT,  -- ⭐ NUEVO
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🆘 Resolución de Problemas

### No veo las imágenes:
1. Verifica que ejecutaste el script SQL: `ALTER TABLE products ADD COLUMN image_url TEXT;`
2. Asegúrate de que la URL de la imagen sea válida y pública
3. Prueba la URL directamente en el navegador

### No veo el botón de pagar:
1. **Importante**: El botón solo aparece cuando **TODOS** los pedidos de la mesa están "Entregados"
2. Ve a `/admin` y verifica que cada pedido esté marcado como "Entregado" (no solo "Listo")
3. Los pedidos cancelados no bloquean el pago
4. Recarga la página de mesa (se actualiza automáticamente cada 5 segundos)
5. El botón aparecerá en la sección de historial con:
   - Mensaje: "✅ Todos los pedidos entregados"
   - Total acumulado
   - Botón "💳 Proceder al Pago"

### El pago con Stripe no funciona:
- **Verifica las claves:** Revisa que las claves en `.env` sean correctas
- **Reinicia el servidor:** Después de cambiar `.env`, reinicia con `npm run dev`
- **Modo Test:** Usa tarjeta de prueba: `4242 4242 4242 4242`
- **Consola del navegador:** Abre DevTools (F12) y busca errores
- **Ver logs:** El servidor mostrará errores si las claves son incorrectas
- **Guía completa:** Consulta `CONFIGURACION-STRIPE.md`

---

## 📋 Checklist de Implementación

- ✅ Autenticación con contraseña
- ✅ Botón de logout
- ✅ Formulario con campo de imagen
- ✅ Visualización de imágenes en admin
- ✅ Visualización de imágenes en mesa
- ✅ Botón de pago en historial (todos entregados)
- ✅ Página de pago completa
- ✅ Integración real con Stripe
- ✅ Stripe Payment Element
- ✅ API de PaymentIntent
- ✅ Dos métodos de pago (Tarjeta/Barra)
- ✅ Generación de tickets
- ✅ Función de impresión
- ✅ Script SQL para columna image_url
- ✅ Actualización de funciones de productos
- ✅ Documentación de Stripe

---

## 🎯 Próximos Pasos Sugeridos

1. **Configurar Stripe** ⚡ IMPORTANTE:
   - Seguir guía en `CONFIGURACION-STRIPE.md`
   - Obtener claves API
   - Configurar `.env`
   - Probar con tarjeta de test

2. **Webhooks de Stripe** (Recomendado):
   - Configurar webhook para confirmar pagos
   - Endpoint: `/api/stripe-webhook`
   - Eventos: `payment_intent.succeeded`

2. **Subida de archivos**:
   - Configurar Supabase Storage
   - Implementar upload de imágenes
   - Eliminar necesidad de URLs externas

3. **Mejoras de seguridad**:
   - Usar variables de entorno
   - JWT para autenticación
   - HTTPS obligatorio

4. **Funcionalidades adicionales**:
   - Email con ticket
   - QR code en tickets
   - Historial de pagos
   - Estadísticas de ventas

---

## 📞 ¿Necesitas Ayuda?

Si necesitas:
- Configurar Supabase Storage para imágenes
- Implementar Stripe real
- Mejorar la seguridad
- Cualquier otra funcionalidad

¡Solo pregunta! 🚀
