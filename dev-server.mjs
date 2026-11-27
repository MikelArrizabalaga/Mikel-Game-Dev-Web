import { randomUUID } from 'node:crypto';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:http';

const files = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/proyectos.html', ['proyectos.html', 'text/html; charset=utf-8']],
  ['/styles.css', ['styles.css', 'text/css; charset=utf-8']],
  ['/theme.js', ['theme.js', 'text/javascript; charset=utf-8']],
  ['/binary-background.js', ['binary-background.js', 'text/javascript; charset=utf-8']],
  ['/binary-reveal.js', ['binary-reveal.js', 'text/javascript; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
  ['/shader-preview.js', ['shader-preview.js', 'text/javascript; charset=utf-8']],
  ['/assets/favicon.png', ['assets/favicon.png', 'image/png']],
  ['/assets/social-preview.png', ['assets/social-preview.png', 'image/png']],
  ['/assets/the-next-stop.jpg', ['assets/the-next-stop.jpg', 'image/jpeg']],
  ['/assets/the-next-stop.webp', ['assets/the-next-stop.webp', 'image/webp']],
  ['/assets/dont-anger-the-boss.webp', ['assets/dont-anger-the-boss.webp', 'image/webp']],
  ['/assets/res-vr.webp', ['assets/res-vr.webp', 'image/webp']],
  ['/assets/previr-ctx.webp', ['assets/previr-ctx.webp', 'image/webp']],
  ['/assets/eli-k-on.webp', ['assets/eli-k-on.webp', 'image/webp']],
  ['/assets/bio-tutorial.webp', ['assets/bio-tutorial.webp', 'image/webp']],
  ['/assets/vuela-liz.webp', ['assets/vuela-liz.webp', 'image/webp']],
  ['/assets/hur.webp', ['assets/hur.webp', 'image/webp']],
  ['/assets/clay-shader.webp', ['assets/clay-shader.webp', 'image/webp']],
  ['/assets/jemsa-dithering.webp', ['assets/jemsa-dithering.webp', 'image/webp']],
  ['/assets/jemsa-dithering-720.webp', ['assets/jemsa-dithering-720.webp', 'image/webp']],
  ['/assets/jemsa-visual-effect.webp', ['assets/jemsa-visual-effect.webp', 'image/webp']],
  ['/assets/jemsa-visual-effect-720.webp', ['assets/jemsa-visual-effect-720.webp', 'image/webp']],
  ['/assets/jemsa-dancing.webp', ['assets/jemsa-dancing.webp', 'image/webp']],
  ['/assets/beam-vfx.webp', ['assets/beam-vfx.webp', 'image/webp']],
  ['/assets/beam-vfx-720.webp', ['assets/beam-vfx-720.webp', 'image/webp']],
  ['/assets/fonts/geist.woff2', ['assets/fonts/geist.woff2', 'font/woff2']],
  ['/assets/fonts/spacegrotesk.woff2', ['assets/fonts/spacegrotesk.woff2', 'font/woff2']],
]);

const port = Number(process.env.AUTONOMO_PREVIEW_PORT || 4173);
const outbox = await mkdtemp(join(tmpdir(), 'autonomo-encargos-'));

function json(response, status, data) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  }).end(JSON.stringify(data));
}

async function handleBrief(request, response) {
  if (request.method === 'GET') return json(response, 200, { mode: 'local' });
  if (request.method !== 'POST') return json(response, 405, { ok: false });
  const host = request.headers.host;
  if (!['127.0.0.1:' + port, 'localhost:' + port].includes(host) ||
      request.headers.origin !== 'http://' + host) {
    return json(response, 403, { ok: false });
  }
  if (request.headers['content-type']?.split(';')[0] !== 'application/x-www-form-urlencoded') {
    return json(response, 415, { ok: false });
  }

  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 16384) {
      json(response, 413, { ok: false });
      return;
    }
    chunks.push(chunk);
  }

  const fields = new URLSearchParams(Buffer.concat(chunks).toString('utf8'));
  const email = (fields.get('email') || '').trim();
  const message = (fields.get('message') || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !message || message.length > 1200) {
    return json(response, 400, { ok: false });
  }
  const service = (fields.get('service') || '').slice(0, 100);
  const phase = (fields.get('phase') || '').slice(0, 100);
  const submission = { receivedAt: new Date().toISOString(), email, message, service, phase };
  await writeFile(join(outbox, randomUUID() + '.json'), JSON.stringify(submission, null, 2), { flag: 'wx', mode: 0o600 });
  return json(response, 201, { ok: true });
}

createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://127.0.0.1').pathname;
  if (pathname === '/api/encargos') {
    try {
      await handleBrief(request, response);
    } catch (error) {
      console.error(error.message);
      if (!response.headersSent) json(response, 500, { ok: false });
    }
    return;
  }
  const asset = files.get(pathname);

  if (!asset) {
    response.writeHead(404).end('Archivo no encontrado');
    return;
  }

  const [filename, type] = asset;
  try {
    const contents = await readFile(new URL(filename, import.meta.url));
    response.writeHead(200, {
      'Content-Type': type,
      'Cache-Control': 'no-cache',
    }).end(contents);
  } catch (error) {
    console.error(error.message);
    response.writeHead(500).end('Error al leer el archivo');
  }
}).listen(port, '127.0.0.1', () => {
  console.log('Vista local: http://127.0.0.1:' + port);
  console.log('Encargos de prueba: ' + outbox);
});
