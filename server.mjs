#!/usr/bin/env node
/**
 * Servidor para Astro en Render
 * Ejecuta el servidor SSR de Astro
 */

import http from 'http';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

// Importar el handler de Astro
const { default: handler } = await import('./dist/server/entry.mjs');

const server = http.createServer(async (req, res) => {
  console.log(`📍 ${req.method} ${req.url}`);
  
  try {
    // Pasar la solicitud al handler de Astro
    await handler(req, res);
  } catch (error) {
    console.error('❌ Error:', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor Astro iniciado en puerto ${PORT}`);
  console.log(`📍 Accesible en http://0.0.0.0:${PORT}`);
  console.log(`✅ Rutas dinámicas habilitadas`);
});
