#!/usr/bin/env node
// Servidor para BarBorja en Render
import http from 'http';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Importar SOLO el handler, no usar startServer de Astro
    const module = await import('./dist/server/entry.mjs');
    const { handler } = module;
    
    if (!handler) {
      throw new Error('No handler export found in entry.mjs');
    }

    // Crear servidor HTTP simple
    const server = http.createServer(async (req, res) => {
      try {
        // Delegar a Astro handler
        await handler(req, res);
      } catch (error) {
        console.error('[ERROR] Request failed:', error);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    });

    // Iniciar servidor en puerto asignado
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ BarBorja Server Started`);
      console.log(`📍 Listening on http://0.0.0.0:${PORT}`);
      console.log(`🌍 Visit http://localhost:${PORT}`);
    });

    // Manejo de errores
    server.on('error', (error) => {
      console.error('[ERROR] Server error:', error);
      process.exit(1);
    });

  } catch (error) {
    console.error('[ERROR] Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
