# Tabla Pedidos a Domicilio

## Estructura de la tabla

La tabla `pedidos_domicilio` incluye todos los campos solicitados:

- **Información del cliente**: nombre, apellidos, DNI, teléfono, dirección
- **Productos**: almacenados en formato JSON para flexibilidad
- **Estado de pago**: campo booleano `is_paid`
- **Campos adicionales**: total del pedido, timestamps de creación y actualización

## Ejemplos de uso

### Insertar un nuevo pedido

```sql
INSERT INTO pedidos_domicilio (
    nombre, 
    apellidos, 
    dni, 
    telefono, 
    direccion, 
    productos, 
    total, 
    is_paid
) VALUES (
    'Juan',
    'García López',
    '12345678A',
    '666777888',
    'Calle Mayor 123, 2º A, 28001 Madrid',
    '[
        {"id": 1, "nombre": "Paella Valenciana", "cantidad": 2, "precio": 12.50},
        {"id": 5, "nombre": "Sangría", "cantidad": 1, "precio": 8.00}
    ]'::jsonb,
    33.00,
    false
);
```

### Consultar pedidos pendientes de pago

```sql
SELECT 
    id,
    nombre,
    apellidos,
    telefono,
    total,
    created_at
FROM pedidos_domicilio 
WHERE is_paid = false 
ORDER BY created_at DESC;
```

### Marcar un pedido como pagado

```sql
UPDATE pedidos_domicilio 
SET is_paid = true 
WHERE id = 1;
```

### Buscar pedidos por cliente

```sql
SELECT * FROM pedidos_domicilio 
WHERE dni = '12345678A' 
ORDER BY created_at DESC;
```

### Consultar productos de un pedido específico

```sql
SELECT 
    id,
    nombre || ' ' || apellidos as cliente,
    jsonb_pretty(productos) as detalle_productos,
    total
FROM pedidos_domicilio 
WHERE id = 1;
```

## Ventajas del diseño

1. **Campo productos en JSONB**: Permite almacenar múltiples productos con toda su información de forma flexible
2. **Índices optimizados**: Para búsquedas rápidas por DNI, teléfono, estado de pago y fecha
3. **Trigger automático**: Actualiza `updated_at` automáticamente en cada modificación
4. **Comentarios en BD**: Documentación directa en la base de datos