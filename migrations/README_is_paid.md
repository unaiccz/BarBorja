# Migración: Campo is_paid en Orders

## Descripción
Esta migración agrega el campo `is_paid` (booleano) y `payment_method` (varchar) a la tabla `orders` para mejorar el seguimiento de pagos.

## Cambios en la Base de Datos

### Nuevos Campos:
- **`is_paid`** (BOOLEAN): Indica si el pedido ha sido pagado
  - `false` por defecto
  - `true` cuando se confirma el pago

- **`payment_method`** (VARCHAR(20)): Método de pago utilizado
  - `'efectivo'`: Pago en barra
  - `'tarjeta'`: Pago con tarjeta Stripe
  - `NULL`: Sin pago aún

## Aplicar la Migración en Supabase

### Opción 1: Desde el Dashboard de Supabase
1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Navega a **SQL Editor**
3. Crea una nueva query
4. Copia y pega el contenido de `migrations/add_is_paid_field.sql`
5. Ejecuta la query

### Opción 2: Usando Supabase CLI (si está instalado)
```bash
supabase db push
```

## Funcionalidad Implementada

### 1. Pago con Tarjeta (Stripe)
- Cliente paga con tarjeta en `/payment/mesa-X`
- Al confirmar el pago:
  - `is_paid` → `true`
  - `payment_method` → `'tarjeta'`
  - `status` → `'pagado'`

### 2. Pago en Barra
- Cliente selecciona "Pagar en Barra"
- Se marca pedido con `status` → `'pagado'`
- **El admin debe confirmar el pago**

### 3. Confirmación desde Admin
- En el panel de admin, los pedidos con `status='entregado'` o `status='pagado'` pero `is_paid=false`
- Muestran botón: **"💵 Confirmar Pago en Barra"**
- Al confirmar:
  - `is_paid` → `true`
  - `payment_method` → `'efectivo'`
  - `status` → `'pagado'`

## Visualización en Admin
- ✅ **Pagado** (verde): `is_paid = true`
- ⏳ **Pendiente** (rojo): `is_paid = false`
- Se muestra método de pago si existe

## Verificación Post-Migración
Ejecuta esta query para verificar que los campos se agregaron correctamente:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'orders'
AND column_name IN ('is_paid', 'payment_method');
```

Deberías ver:
- `is_paid` | boolean | NO | false
- `payment_method` | character varying | YES | NULL
