# 🚀 SOLUCIÓN: Error 404 en Render - GUÍA RÁPIDA

## ⚠️ PROBLEMA ACTUAL
`barborja-front.onrender.com/admin` muestra **"Not Found"**

## ✅ SOLUCIÓN (5 MINUTOS)

### PASO 1: Ir a Render Dashboard
https://dashboard.render.com/

### PASO 2: Selecciona tu servicio `barborja-app`

### PASO 3: Click en "Environment" en la left sidebar

### PASO 4: Agrega estas variables (copy-paste):

```
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_KEY=
PUBLIC_STRIPE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
NODE_ENV=production
```

**¿De dónde sacar los valores?**
- Abre tu proyecto Supabase → Settings → API
- Abre Stripe Dashboard → API Keys
- Copia los valores exactos

### PASO 5: Click en "Manual Deploy"
En la parte superior derecha de la página del servicio

### PASO 6: Espera a que compile
Verás "Building..." → espera a que diga "Live"

### PASO 7: Prueba la URL
- barborja-front.onrender.com/admin ✅
- barborja-front.onrender.com/ ✅

---

## 📋 ¿QUÉ CAMBIÓ EN TU CÓDIGO?

1. **render.yaml** ← Nuevo (configuración de Render)
2. **server.mjs** ← Nuevo (servidor Node puro)
3. **astro.config.mjs** ← Simplificado (removido Express)

**Todos los archivos están listos en tu repo. Solo necesitas:**
1. Configurar variables en Render Dashboard
2. Hacer Manual Deploy
3. Esperar 2 minutos

---

## 🐛 SI SIGUE FALLANDO:

1. Ve a tu servicio en Render Dashboard
2. Click en "Logs"
3. Busca errores (verás líneas rojas)
4. Si dice "Cannot find module" → problema de build
5. Si dice "Cannot connect to Supabase" → variables mal copiadas
6. Comparte los logs para debugging

---

## ✨ CHECKLIST FINAL

- [ ] Abrí Render Dashboard
- [ ] Seleccioné mi servicio `barborja-app`
- [ ] Fui a "Environment"
- [ ] Agregué las 6 variables de entorno
- [ ] Hice "Manual Deploy"
- [ ] Esperé a que compile (3-5 min)
- [ ] Probé barborja-front.onrender.com/admin
- [ ] ✅ FUNCIONA

---

**SI SIGUE SIN FUNCIONAR DESPUÉS DE 10 MINUTOS:**
- Limpia caché: Menu → "Clear Build Cache" → redeploy
- Verifica logs en Dashboard → Logs
- Comparte error específico de los logs
