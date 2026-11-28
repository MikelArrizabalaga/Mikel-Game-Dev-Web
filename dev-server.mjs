import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';

const files = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/proyectos.html', ['proyectos.html', 'text/html; charset=utf-8']],
  ['/aviso-legal.html', ['aviso-legal.html', 'text/html; charset=utf-8']],
  ['/privacidad.html', ['privacidad.html', 'text/html; charset=utf-8']],
  ['/sitemap.xml', ['sitemap.xml', 'application/xml; charset=utf-8']],
  ['/styles.css', ['styles.css', 'text/css; charset=utf-8']],
  ['/theme.js', ['theme.js', 'text/javascript; charset=utf-8']],
  ['/i18n.js', ['i18n.js', 'text/javascript; charset=utf-8']],
  ['/binary-background.js', ['binary-background.js', 'text/javascript; charset=utf-8']],
  ['/binary-reveal.js', ['binary-reveal.js', 'text/javascript; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
  ['/shader-preview.js', ['shader-preview.js', 'text/javascript; charset=utf-8']],
  ['/assets/favicon-ma.png', ['assets/favicon-ma.png', 'image/png']],
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
