# Error 404 en Render - Solución Completa ✅

## Problema

Accedes a `barborja-front.onrender.com/admin` y ves **"Not Found"**

## Causa

Render **NO tiene las variables de entorno configuradas**. Sin las variables de entorno, el servidor de Astro no puede conectar con Supabase, causando errores en las rutas dinámicas.

---

## Solución - PASO A PASO

### PASO 1: Configura Variables de Entorno en Render Dashboard

1. **Ir a Render Dashboard**: https://dashboard.render.com/
2. **Selecciona tu servicio** `barborja-app`
3. **Click en "Environment"** en la sidebar izquierda
4. **Agregar las siguientes variables:**

```
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_KEY=eyJhbGciOiJIUzI1NiI...
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiI...
STRIPE_SECRET_KEY=sk_live_...
NODE_ENV=production
```

**¿De dónde obtener estos valores?**
- `PUBLIC_SUPABASE_URL`: Settings → API en Supabase
- `PUBLIC_SUPABASE_KEY`: anon key en Supabase
- `PUBLIC_STRIPE_PUBLISHABLE_KEY`: Tu dashboard de Stripe
- `SUPABASE_SERVICE_ROLE_KEY`: service_role key en Supabase
- `STRIPE_SECRET_KEY`: Tu dashboard de Stripe

### PASO 2: Redeploy en Render

1. En Render Dashboard → Tu servicio
2. **Click en "Manual Deploy"** (parte superior derecha)
3. Espera a que compile (verás "Building...")
4. Una vez completo, prueba la URL

---

## Verificación Rápida

Para asegurar que todo está correcto ANTES de desplegar en Render:

### Localmente:
```bash
# Compilar
npm run build

# Iniciar servidor
node ./server.mjs
```

Deberías ver:
```
🚀 Servidor Astro iniciado en puerto 3000
📍 Accesible en http://0.0.0.0:3000
✅ Rutas dinámicas habilitadas
```

Luego accede a:
- http://localhost:3000/admin ✅ Debe funcionar
- http://localhost:3000/mesa/5 ✅ Debe funcionar
- http://localhost:3000/ ✅ Debe funcionar

---

## Estructura de Archivos Correcta

```
app/
├── render.yaml           ← ✅ Configuración de Render
├── server.mjs            ← ✅ Servidor Node puro (sin Express)
├── astro.config.mjs      ← ✅ Configuración limpia de Astro
├── package.json
├── src/
│   ├── pages/
│   │   ├── admin/index.astro
│   │   ├── mesa/[numero].astro
│   │   ├── payment/mesa-[numero].astro
│   │   └── ...
│   ├── functions/
│   └── ...
└── dist/                 ← Generado por build
    ├── client/
    ├── server/
    └── ...
```

---

## Archivos Actualizados

### `render.yaml`
```yaml
services:
  - type: web
    name: barborja-app
    runtime: node
    plan: free
    branch: main
    buildCommand: npm run build
    startCommand: node ./server.mjs
    envVars:
      - key: NODE_ENV
        value: production
```

✅ **Cambios:**
- Usa `node ./server.mjs` (servidor Node puro)
- Las variables de entorno se configuran en el Dashboard

### `server.mjs` (Nuevo)
```javascript
import http from 'http';
import { fileURLToPath } from 'url';
import path from 'path';

const { default: handler } = await import('./dist/server/entry.mjs');
const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  console.log(`📍 ${req.method} ${req.url}`);
  try {
    await handler(req, res);
  } catch (error) {
    console.error('❌ Error:', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor Astro iniciado en puerto ${PORT}`);
});
```

✅ **Cambios:**
- Node HTTP puro (sin Express)
- Delega a Astro SSR handler
- Escucha en `0.0.0.0` (necesario para Render)

### `astro.config.mjs`
```javascript
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  })
});
```

✅ **Cambios:**
- Configuración limpia y simple
- Sin middleware innecesario

---

## Flujo de Solicitud en Render

```
Usuario accede a barborja-front.onrender.com/admin
                    ↓
        Render enruta a Node.js
                    ↓
            server.mjs inicia
                    ↓
    Lee variables de entorno (Dashboard)
                    ↓
        Carga dist/server/entry.mjs (Astro)
                    ↓
        Handler de Astro procesa /admin
                    ↓
    Conecta a Supabase con credenciales
                    ↓
        Renderiza admin/index.astro
                    ↓
    Retorna HTML generado al navegador
                    ↓
✅ Página carga correctamente
```

---

## Troubleshooting

### 1. Aún veo "Not Found"

**Solución:**
- Verifica que las variables de entorno estén en Render Dashboard
- Haz "Clear Build Cache" en Render
- Redeploy manualmente
- Espera 2-3 minutos a que Render cachee

### 2. Error de conexión a Supabase

**Solución:**
- Verifica que `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_KEY` sean correctos
- Accede a Supabase → Settings → API
- Copia exactamente el URL y la anon key

### 3. Error de Stripe

**Solución:**
- Verifica que `PUBLIC_STRIPE_PUBLISHABLE_KEY` sea correcto
- Verifica que `STRIPE_SECRET_KEY` sea correcto (solo en build)
- Accede a tu dashboard de Stripe → API Keys

### 4. Puerto incorrecto

Render asigna automáticamente un puerto. Usa:
```javascript
const PORT = process.env.PORT || 3000;
```

---

## Comandos Útiles

### Ver logs de Render:
Render Dashboard → Tu servicio → "Logs"

### Rebuilds manuales:
Render Dashboard → Tu servicio → "Manual Deploy"

### Limpiar caché:
Render Dashboard → Tu servicio → Menu (tres puntos) → "Clear Build Cache"

---

## Checklist Final

- [ ] Variables de entorno configuradas en Render Dashboard
- [ ] `render.yaml` existe en root del proyecto
- [ ] `server.mjs` existe en root del proyecto
- [ ] `astro.config.mjs` es simple y limpio
- [ ] `npm run build` compila sin errores
- [ ] `node ./server.mjs` inicia localmente sin errores
- [ ] Rutas locales funcionan: `/admin`, `/mesa/5`, etc.
- [ ] Variables de entorno son válidas (probadas localmente)
- [ ] Push a GitHub desde main branch
- [ ] Render detectó cambios y deployó
- [ ] Rutas en Render funcionan correctamente

---

## Próximo Paso

1. **Configura variables de entorno en Render Dashboard**
2. **Haz Manual Deploy**
3. **Prueba**: barborja-front.onrender.com/admin
4. **Si sigue fallando**: Comparte logs de Render (Dashboard → Logs)

---

**Causa más probable del "Not Found":** Variables de entorno no configuradas  
**Solución:** Ir a Render Dashboard → Environment → Agregar variables  
**Tiempo estimado:** 5 minutos  
