# 🔐 Configuración de Stripe - BarBorja

## 📋 Pasos para Configurar Stripe

### 1. Crear Cuenta en Stripe

1. Ve a [https://stripe.com](https://stripe.com)
2. Haz clic en "Sign up"
3. Completa el registro con tu información

### 2. Obtener las Claves API

#### Modo Test (Desarrollo):

1. Ve al [Dashboard de Stripe](https://dashboard.stripe.com)
2. Activa el modo **"Test mode"** (toggle en la esquina superior derecha)
3. Ve a **Developers → API keys**
4. Copia las claves:
   - **Publishable key** (empieza con `pk_test_`)
   - **Secret key** (empieza con `sk_test_`) - **¡NUNCA la compartas!**

#### Modo Live (Producción):

1. Completa la información de tu negocio en Stripe
2. Desactiva el modo "Test mode"
3. Ve a **Developers → API keys**
4. Copia las claves:
   - **Publishable key** (empieza con `pk_live_`)
   - **Secret key** (empieza con `sk_live_`)

---

## 🔧 Configurar las Variables de Entorno

### 1. Crea el archivo `.env` (si no existe):

```bash
# En la raíz del proyecto
cp .env.example .env
```

### 2. Edita el archivo `.env` y agrega tus claves:

```bash
# Stripe Configuration - MODO TEST
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_aqui
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica_aqui
```

**Ejemplo real:**
```bash
STRIPE_SECRET_KEY=sk_test_51AbCdEf123456789_ejemplo
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51AbCdEf987654321_ejemplo
```

---

## ✅ Verificar la Instalación

### 1. Reinicia el servidor:

```bash
# Detén el servidor (Ctrl+C)
# Vuelve a iniciarlo:
npm run dev
```

### 2. Prueba el flujo de pago:

1. Ve a una mesa: `http://localhost:4321/mesa/1`
2. Haz un pedido
3. Marca el pedido como "Entregado" en admin
4. Haz clic en "Proceder al Pago"
5. Selecciona "Pagar con Tarjeta"
6. Deberías ver el formulario de Stripe

---

## 🧪 Tarjetas de Prueba (Modo Test)

Usa estas tarjetas para probar en modo test:

### ✅ Pago Exitoso:
```
Número: 4242 4242 4242 4242
Fecha: Cualquier fecha futura (ej: 12/25)
CVC: Cualquier 3 dígitos (ej: 123)
Código Postal: Cualquier código
```

### ❌ Pago Rechazado:
```
Número: 4000 0000 0000 0002
Fecha: Cualquier fecha futura
CVC: Cualquier 3 dígitos
```

### 🔐 Requiere Autenticación 3D Secure:
```
Número: 4000 0027 6000 3184
Fecha: Cualquier fecha futura
CVC: Cualquier 3 dígitos
```

Más tarjetas de prueba: [Stripe Testing Cards](https://stripe.com/docs/testing#cards)

---

## 🎨 Personalización del Formulario

El formulario de Stripe ya está personalizado con los colores de BarBorja en:
`src/pages/payment/mesa-[numero].astro`

Puedes modificar la apariencia editando el objeto `appearance`:

```javascript
const appearance = {
    theme: 'stripe',
    variables: {
        colorPrimary: '#667eea',      // Color principal
        colorBackground: '#ffffff',    // Fondo
        colorText: '#2c3e50',         // Texto
        colorDanger: '#e74c3c',       // Error
        fontFamily: 'system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
    }
};
```

---

## 📊 Ver Pagos en el Dashboard

1. Ve al [Dashboard de Stripe](https://dashboard.stripe.com)
2. En modo Test, ve a **Payments**
3. Verás todos los pagos de prueba
4. Haz clic en un pago para ver detalles:
   - Mesa número
   - Order IDs
   - Monto
   - Estado

---

## 🔒 Seguridad

### ✅ Buenas Prácticas:

1. **NUNCA** compartas tu `STRIPE_SECRET_KEY`
2. **NUNCA** subas el archivo `.env` a Git
3. El `.env` ya está en `.gitignore`
4. Usa claves de test (`sk_test_`) en desarrollo
5. Usa claves de producción (`sk_live_`) solo en producción

### 🔐 Variables de Entorno Seguras:

- `STRIPE_SECRET_KEY` → Solo en servidor, NUNCA en cliente
- `PUBLIC_STRIPE_PUBLISHABLE_KEY` → Puede estar en cliente (es pública)

---

## 🚀 Pasar a Producción

### 1. Completa la información de tu negocio en Stripe:
   - Ve a **Settings → Business settings**
   - Completa todos los datos requeridos
   - Verifica tu cuenta bancaria

### 2. Cambia a claves de producción:
   ```bash
   # En .env
   STRIPE_SECRET_KEY=sk_live_tu_clave_real
   PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_tu_clave_real
   ```

### 3. Configura Webhooks (opcional pero recomendado):
   - Ve a **Developers → Webhooks**
   - Añade endpoint: `https://tu-dominio.com/api/stripe-webhook`
   - Selecciona eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`

---

## 🐛 Solución de Problemas

### Error: "Stripe is not defined"
- Verifica que tienes la clave pública en `.env`
- Reinicia el servidor
- Verifica que el script de Stripe se carga: `<script src="https://js.stripe.com/v3/"></script>`

### Error: "Invalid API Key"
- Verifica que copiaste la clave completa (incluyendo `sk_test_` o `pk_test_`)
- Asegúrate de que no hay espacios al inicio o final
- Verifica que estás usando la clave correcta (test/live)

### El formulario no aparece:
- Abre la consola del navegador (F12)
- Busca errores de JavaScript
- Verifica que `/api/create-payment-intent` responde correctamente

### Error 401 Unauthorized:
- Tu clave secreta es incorrecta o está vencida
- Genera una nueva clave en el Dashboard de Stripe

---

## 📞 Soporte

- **Documentación Stripe:** [https://stripe.com/docs](https://stripe.com/docs)
- **Stripe Dashboard:** [https://dashboard.stripe.com](https://dashboard.stripe.com)
- **Soporte Stripe:** [https://support.stripe.com](https://support.stripe.com)

---

## ✅ Checklist de Configuración

- [ ] Cuenta de Stripe creada
- [ ] Modo Test activado
- [ ] Claves API copiadas (pk_test_ y sk_test_)
- [ ] Archivo `.env` creado
- [ ] Claves agregadas al `.env`
- [ ] Servidor reiniciado
- [ ] Pago de prueba realizado con éxito
- [ ] Pago visible en Dashboard de Stripe

¡Listo! Tu sistema de pagos está configurado. 🎉
