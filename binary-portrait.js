function samplePortrait(rgba, size) {
  const light = new Float32Array(size * size);
  const backdrop = new Uint8Array(light.length);
  const queue = new Uint16Array(light.length);
  let tail = 0;
  for (let i = 0; i < light.length; i++) {
    const offset = i * 4;
    const luminance = (rgba[offset] * .2126 + rgba[offset + 1] * .7152 + rgba[offset + 2] * .0722) / 255;
    light[i] = 1 - (1 - luminance) * rgba[offset + 3] / 255;
  }

  // Exclude whites connected to the frame, while keeping highlights inside the face.
  function visit(x, y) {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    const i = y * size + x;
    if (backdrop[i] || light[i] < .88) return;
    backdrop[i] = 1;
    queue[tail++] = i;
  }

  for (let position = 0; position < size; position++) {
    visit(position, 0);
    visit(position, size - 1);
    visit(0, position);
    visit(size - 1, position);
  }
  for (let head = 0; head < tail; head++) {
    const x = queue[head] % size;
    const y = Math.floor(queue[head] / size);
    visit(x - 1, y);
    visit(x + 1, y);
    visit(x, y - 1);
    visit(x, y + 1);
  }
  return { light, backdrop };
}

function initBinaryPortrait(background, pattern, angle, getPatternLines) {
  const region = document.querySelector('[data-portrait]');
  if (!region) return;
  const canvas = document.createElement('canvas');
  const atlas = document.createElement('canvas');
  const sample = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const glyphs = atlas.getContext('2d');
  const sampler = sample.getContext('2d');
  if (!context || !glyphs || !sampler) return;

  canvas.className = 'binary-portrait-grid';
  canvas.hidden = true;
  background.append(canvas);

  const resolution = 144;
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  const forcedColors = matchMedia('(forced-colors: active)');
  let portrait;
  let frame;

  function draw() {
    frame = undefined;
    const bounds = region.getBoundingClientRect();
    const { width, height, left, top } = background.getBoundingClientRect();
    const active = portrait && !forcedColors.matches && bounds.width &&
      bounds.bottom > top && bounds.top < top + height;
    canvas.hidden = !active;
    pattern.style.visibility = active ? 'hidden' : '';
    if (!active) return;

    const scale = Math.min(window.devicePixelRatio || 1, 1.5);
    const pixelWidth = Math.round(width * scale);
    const pixelHeight = Math.round(height * scale);
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, pixelWidth, pixelHeight);
    context.setTransform(scale, 0, 0, scale, pixelWidth / 2, pixelHeight / 2);
    context.rotate(-angle);

    const style = getComputedStyle(pattern);
    const palette = [style.color, style.getPropertyValue('--accent').trim(), getComputedStyle(region).color];
    const font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    glyphs.font = font;
    const digitWidth = glyphs.measureText('0').width;
    const advance = digitWidth + parseFloat(style.letterSpacing);
    const lineHeight = parseFloat(style.lineHeight);
    const cellWidth = Math.ceil((digitWidth + 2) * scale);
    const cellHeight = Math.ceil(lineHeight * scale);
    atlas.width = 2 * cellWidth;
    atlas.height = palette.length * cellHeight;
    glyphs.setTransform(scale, 0, 0, scale, 0, 0);
    glyphs.font = font;
    glyphs.textBaseline = 'middle';
    palette.forEach((color, row) => {
      const y = (row + .5) * cellHeight / scale;
      glyphs.fillStyle = color;
      glyphs.fillText('0', 1, y);
      glyphs.fillText('1', 1 + cellWidth / scale, y);
    });

    const originX = -pattern.offsetWidth / 2;
    const originY = -pattern.offsetHeight / 2;
    const lines = getPatternLines();
    for (let row = 0; row < lines.length; row++) {
      const y = originY + (row + .5) * lineHeight;
      const line = lines[row];
      for (let column = 0; column < line.length; column++) {
        const digit = line[column];
        if (digit === ' ') continue;
        const x = originX + column * advance;
        const centerX = x + digitWidth / 2;
        const screenX = centerX * cos + y * sin + width / 2;
        const screenY = y * cos - centerX * sin + height / 2;
        if (screenX < -lineHeight || screenX > width + lineHeight ||
            screenY < -lineHeight || screenY > height + lineHeight) continue;

        const u = (screenX + left - bounds.left) / bounds.width;
        const v = (screenY + top - bounds.top) / bounds.height;
        let level = 0;
        let lift = 0;
        let opacity = .045;
        if (u >= 0 && u < 1 && v >= 0 && v < 1) {
          const index = Math.floor(v * resolution) * resolution + Math.floor(u * resolution);
          if (!portrait.backdrop[index]) {
            const light = portrait.light[index];
            const edge = Math.min(1, u / .08, (1 - u) / .075, v / .055, (1 - v) / .19);
            level = light > .72 ? 2 : 1;
            lift = 7 * (1 - light) ** 1.2 * edge;
            opacity += edge * (.24 + .66 * light ** .75);
          }
        }
        context.globalAlpha = opacity;
        context.drawImage(atlas, digit === '1' ? cellWidth : 0, level * cellHeight, cellWidth, cellHeight,
          x + sin * lift - 1, y - cos * lift - cellHeight / (2 * scale), cellWidth / scale, cellHeight / scale);
      }
    }
  }

  function refresh() {
    if (frame === undefined) frame = requestAnimationFrame(draw);
  }

  const image = new Image();
  image.addEventListener('load', () => {
    sample.width = sample.height = resolution;
    sampler.imageSmoothingQuality = 'high';
    const width = image.naturalWidth;
    const height = image.naturalHeight;
    // Sample inside the solid black frame of the supplied portrait.
    sampler.drawImage(image, width * .028, height * .032, width * .943, height * .943, 0, 0, resolution, resolution);
    portrait = samplePortrait(sampler.getImageData(0, 0, resolution, resolution).data, resolution);
    new ResizeObserver(refresh).observe(region);
    window.addEventListener('scroll', refresh, { passive: true });
    window.addEventListener('themechange', refresh);
    forcedColors.addEventListener('change', refresh);
    refresh();
  }, { once: true });
  image.src = region.dataset.portrait;
  return refresh;
}
