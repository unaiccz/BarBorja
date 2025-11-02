#!/usr/bin/env node
import http from 'http';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Importar solo el handler, NO ejecutar el servidor de Astro
const mod = await import('./dist/server/entry.mjs');
const handler = mod.handler;

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  try {
    await handler(req, res);
  } catch (error) {
    console.error('Error handling request:', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ BarBorja server running on http://0.0.0.0:${PORT}`);
});
