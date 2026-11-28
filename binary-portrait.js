function initBinaryPortrait() {
  const canvas = document.querySelector('.hero-portrait');
  const context = canvas.getContext('2d');
  const sample = document.createElement('canvas');
  const sampler = sample.getContext('2d');
  if (!context || !sampler) return;

  const image = new Image();
  const resolution = 144;
  const angle = 16 * Math.PI / 180;
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  let pixels;

  function draw() {
    const size = canvas.clientWidth;
    if (!size || !pixels) return;
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.height = Math.round(size * scale);
    context.setTransform(scale, 0, 0, scale, size * scale / 2, size * scale / 2);
    context.rotate(-angle);
    const style = getComputedStyle(canvas);
    const fontSize = Math.max(5.8, size / 76);
    const stepX = fontSize * .84;
    const stepY = fontSize * 1.12;
    const extent = size * (sin + cos) / 2;
    context.font = `600 ${fontSize}px ${style.getPropertyValue('--font-bits').trim()}`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    const accent = style.getPropertyValue('--accent').trim();
    const depthColor = style.getPropertyValue('--ink').trim();

    for (let row = -Math.ceil(extent / stepY); row * stepY < extent; row++) {
      const y = row * stepY;
      for (let column = -Math.ceil(extent / stepX); column * stepX < extent; column++) {
        const x = column * stepX;
        const u = .5 + (x * cos + y * sin) / size;
        const v = .5 + (y * cos - x * sin) / size;
        if (u <= 0 || u >= 1 || v <= 0 || v >= 1) continue;

        const i = (Math.floor(v * resolution) * resolution + Math.floor(u * resolution)) * 4;
        const light = (pixels[i] * .2126 + pixels[i + 1] * .7152 + pixels[i + 2] * .0722) / 255;
        const depth = (1 - light) ** .92 * pixels[i + 3] / 255;
        const edge = Math.min(1, u / .09, (1 - u) / .12, v / .06, (1 - v) / .19);
        if (depth < .07) continue;

        const bit = (column + row * 3) & 1;
        const lift = fontSize * .52 * depth ** 1.4;
        context.fillStyle = depthColor;
        context.globalAlpha = depth * edge * .13;
        context.fillText(bit, x, y);
        context.fillStyle = accent;
        context.globalAlpha = depth * edge * .78;
        context.fillText(bit, x + lift * sin, y - lift * cos);
      }
    }
  }

  image.addEventListener('load', () => {
    sample.width = sample.height = resolution;
    sampler.imageSmoothingQuality = 'high';
    const w = image.naturalWidth;
    const h = image.naturalHeight;
    // Sample inside the solid black frame of the supplied portrait.
    sampler.drawImage(image, w * .028, h * .032, w * .943, h * .943, 0, 0, resolution, resolution);
    pixels = sampler.getImageData(0, 0, resolution, resolution).data;
    new ResizeObserver(draw).observe(canvas);
    window.addEventListener('themechange', draw);
    draw();
  }, { once: true });
  image.src = canvas.dataset.portrait;
}

initBinaryPortrait();
