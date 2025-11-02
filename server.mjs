#!/usr/bin/env node
/**
 * Middleware para manejo de rutas SPA en Render
 * Este archivo asegura que todas las rutas dinámicas se sirvan correctamente
 */

import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { handler } from './dist/server/entry.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Configurar directorio estático para archivos públicos
app.use(express.static(path.join(__dirname, 'dist', 'client'), {
  maxAge: '1h',
  etag: false
}));

// Middleware para logging
app.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.path}`);
  next();
});

// Manejo de rutas - delegarlas a Astro SSR
app.use(handler);

// Para desarrollo local
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
  console.log(`📍 Accesible en http://0.0.0.0:${PORT}`);
  console.log(`✅ Routing habilitado para rutas dinámicas`);
});
