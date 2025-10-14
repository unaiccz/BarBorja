# 💳 Sistema de Pago - BarBorja

## 🎯 ¿Cómo Funciona?

### ✅ Condición para que aparezca el botón de pago:

**TODOS los pedidos de la mesa deben estar en estado "Entregado"**

---

## 📊 Ejemplos Visuales

### ❌ NO aparece botón de pago:

```
Mesa 3:
├─ Pedido #5: Entregado ✅
├─ Pedido #8: Listo 🟡        ← Todavía no entregado
└─ Pedido #12: Preparando 🔵

❌ Botón de pago NO visible
```

### ✅ SÍ aparece botón de pago:

```
Mesa 3:
├─ Pedido #5: Entregado ✅
├─ Pedido #8: Entregado ✅
└─ Pedido #12: Entregado ✅

✅ Botón de pago VISIBLE
💰 Total: 45.00€
🔘 "Proceder al Pago"
```

---

## 🔄 Estados de Pedidos

1. **Pendiente** 🟡 - Pedido recibido, esperando preparación
2. **Preparando** 🔵 - En la cocina/barra
3. **Listo** 🟢 - Preparado, esperando ser servido
4. **Entregado** ✅ - Servido al cliente
5. **Cancelado** ❌ - No se cuenta para el pago

---

## 💡 Lógica del Sistema

### Paso 1: Cliente hace pedidos
```javascript
Mesa 5:
- Pedido #10: 2 cervezas (8€)
- Pedido #15: 1 hamburguesa (12€)
- Pedido #20: 2 postres (10€)

Estado inicial: Todos "Pendiente"
```

### Paso 2: Admin procesa cada pedido
```javascript
Admin marca cada pedido:
Pendiente → Preparando → Listo → Entregado
```

### Paso 3: Sistema verifica estado
```javascript
// El sistema verifica automáticamente cada 5 segundos:

const todosEntregados = pedidos.every(p => 
  p.status === 'entregado' || p.status === 'cancelado'
);

if (todosEntregados) {
  mostrarBotonPago(); // ✅
  calcularTotal(); // 30€
}
```

### Paso 4: Cliente procede al pago
```javascript
Cliente hace clic en "Proceder al Pago"
→ Redirige a: /payment/mesa-5
→ Muestra todos los pedidos
→ Total: 30€
→ Opciones: Tarjeta / Barra
```

---

## 🎨 Interfaz Visual

### Historial de Pedidos - TODOS Entregados:

```
┌─────────────────────────────────────────┐
│  📋 Historial de Pedidos - Mesa 5      │
├─────────────────────────────────────────┤
│                                         │
│  Pedido #10        Entregado            │
│  📅 14/10 - 14:30                       │
│  🍺 2x Cerveza                          │
│  Total: 8.00€                           │
│                                         │
│  Pedido #15        Entregado            │
│  📅 14/10 - 14:45                       │
│  🍳 1x Hamburguesa                      │
│  Total: 12.00€                          │
│                                         │
│  Pedido #20        Entregado            │
│  📅 14/10 - 15:00                       │
│  🍳 2x Postre                           │
│  Total: 10.00€                          │
│                                         │
├─────────────────────────────────────────┤
│  ✅ Todos los pedidos entregados        │
│  Total a pagar: 30.00€                  │
│                                         │
│  ┌───────────────────────────────┐     │
│  │  💳 Proceder al Pago          │     │
│  └───────────────────────────────┘     │
└─────────────────────────────────────────┘
```

### Historial de Pedidos - NO Todos Entregados:

```
┌─────────────────────────────────────────┐
│  📋 Historial de Pedidos - Mesa 5      │
├─────────────────────────────────────────┤
│                                         │
│  Pedido #10        Entregado            │
│  📅 14/10 - 14:30                       │
│  🍺 2x Cerveza                          │
│  Total: 8.00€                           │
│                                         │
│  Pedido #15        Listo                │
│  📅 14/10 - 14:45                       │
│  🍳 1x Hamburguesa                      │
│  Total: 12.00€                          │
│                                         │
│  Pedido #20        Preparando           │
│  📅 14/10 - 15:00                       │
│  🍳 2x Postre                           │
│  Total: 10.00€                          │
│                                         │
│  ⏳ Esperando pedidos...                │
└─────────────────────────────────────────┘
```

---

## 🎫 Ticket de Pago (Múltiples Pedidos)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━
     🍽️ BarBorja
     Ticket de Compra
━━━━━━━━━━━━━━━━━━━━━━━━━━

Mesa: 5
Pedidos: #10, #15, #20
Fecha: 14/10/2025 - 15:05
Método: Tarjeta de crédito

━━━━━━━━━━━━━━━━━━━━━━━━━━

Pedido #10
  2x Cerveza          8.00€

Pedido #15
  1x Hamburguesa     12.00€

Pedido #20
  2x Postre          10.00€

━━━━━━━━━━━━━━━━━━━━━━━━━━

TOTAL:               30.00€

━━━━━━━━━━━━━━━━━━━━━━━━━━

¡Gracias por su visita!
www.barborja.com
```

---

## ⚡ Actualización Automática

- El historial se actualiza **cada 5 segundos**
- No necesitas recargar manualmente
- El botón aparecerá automáticamente cuando todos estén entregados

---

## 🔍 Verificación Paso a Paso

### Para el Admin:

1. ✅ Marca cada pedido como "Entregado" (no solo "Listo")
2. ✅ Verifica que TODOS los pedidos de la mesa estén "Entregados"
3. ✅ Los pedidos cancelados no bloquean el pago

### Para el Cliente:

1. ✅ Espera a que todos tus pedidos estén servidos
2. ✅ Verás el mensaje "✅ Todos los pedidos entregados"
3. ✅ Verás el total acumulado
4. ✅ Haz clic en "💳 Proceder al Pago"
5. ✅ Elige tu método de pago
6. ✅ Imprime tu ticket

---

## 🎯 Ventajas de este Sistema

✅ **Pago consolidado**: Una sola transacción para todos los pedidos
✅ **Total claro**: Siempre sabes cuánto vas a pagar
✅ **Un solo ticket**: Con todos los pedidos incluidos
✅ **Experiencia fluida**: El cliente decide cuándo pagar
✅ **Control total**: El admin debe entregar todo antes de cobrar
✅ **Actualización automática**: Sin necesidad de recargar

---

## ❓ Preguntas Frecuentes

**P: ¿Qué pasa si hago otro pedido después de ver el botón de pago?**
R: El botón desaparecerá hasta que el nuevo pedido también esté entregado.

**P: ¿Puedo pagar pedidos individuales?**
R: No, el sistema paga todos los pedidos de la mesa juntos.

**P: ¿Los pedidos cancelados se incluyen en el total?**
R: No, los pedidos cancelados no se cuentan ni bloquean el pago.

**P: ¿Cuánto tarda en aparecer el botón después de entregar el último pedido?**
R: Máximo 5 segundos (tiempo de auto-actualización).

**P: ¿Qué pasa si algunos pedidos son de cocina y otros de barra?**
R: No importa, todos se pagan juntos. El sistema los agrupa automáticamente.
