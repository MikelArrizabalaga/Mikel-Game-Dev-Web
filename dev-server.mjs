import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';

const files = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/styles.css', ['styles.css', 'text/css; charset=utf-8']],
  ['/binary-background.js', ['binary-background.js', 'text/javascript; charset=utf-8']],
  ['/binary-reveal.js', ['binary-reveal.js', 'text/javascript; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
  ['/shader-preview.js', ['shader-preview.js', 'text/javascript; charset=utf-8']],
  ['/assets/favicon.png', ['assets/favicon.png', 'image/png']],
  ['/assets/social-preview.png', ['assets/social-preview.png', 'image/png']],
  ['/assets/fonts/geist.woff2', ['assets/fonts/geist.woff2', 'font/woff2']],
  ['/assets/fonts/spacegrotesk.woff2', ['assets/fonts/spacegrotesk.woff2', 'font/woff2']],
]);

const port = 4173;

createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://127.0.0.1').pathname;
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
});
