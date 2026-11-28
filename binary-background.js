const background = document.querySelector('.binary-background');
const pattern = background.querySelector('pre');
const rotation = 16 * Math.PI / 180;
const signature = '01101101 01101001 01101011 01100101 01101100 00100000 01100001 01110010 01110010 01101001 01111010 01100001 01100010 01100001 01101100 01100001 01100111 01100001 ';
const loopRows = 6;
let previousColumns = 0;
let previousRows = 0;
let patternLines = [];

function renderPattern() {
  const { clientWidth: width, clientHeight: height } = background;
  const { fontSize, lineHeight } = getComputedStyle(pattern);
  const rowWidth = width * Math.cos(rotation) + height * Math.sin(rotation);
  const patternHeight = height * Math.cos(rotation) + width * Math.sin(rotation);
  const columns = Math.ceil(rowWidth / (parseFloat(fontSize) * 0.57)) + 12;
  const rows = Math.ceil(patternHeight / parseFloat(lineHeight)) + loopRows + 4;
  if (columns === previousColumns && rows === previousRows) return;
  previousColumns = columns;
  previousRows = rows;
  const repeated = signature.repeat(Math.ceil((columns + signature.length) / signature.length));

  patternLines = Array.from({ length: rows }, (_, row) => {
    const offset = (row % loopRows) * (signature.length / loopRows);
    return repeated.slice(offset, offset + columns);
  });
  pattern.textContent = patternLines.join('\n');
}

function initReactiveBackground() {
  const canHover = matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const forcedColors = matchMedia('(forced-colors: active)');
  const toggle = document.querySelector('#toggle-animation');
  const layer = document.createElement('div');
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const pulseCanvas = document.createElement('canvas');
  const pulseContext = pulseCanvas.getContext('2d');
  const glyphs = document.createElement('canvas');
  const glyphContext = glyphs.getContext('2d');
  if (!context || !pulseContext || !glyphContext) return;

  layer.className = 'binary-wave';
  layer.setAttribute('aria-hidden', 'true');
  canvas.hidden = pulseCanvas.hidden = true;
  layer.append(pulseCanvas, canvas);
  document.body.append(layer);
  const sin = Math.sin(rotation);
  const cos = Math.cos(rotation);
  let geometry;
  let pointer;
  let press;
  let leavingAt;
  let hoverDirty = false;
  let hoverLevel = 0;
  let lastHoverFrame;
  let frame = null;
  const pulses = [];
  const pulseDuration = 1400;
  const pressDuration = 100;
  const hoverReturnDuration = 180;
  const hoverReturnDistance = 64;
  const liftHeight = 30;
  const hoverOpacity = .64;
  const pulseOpacity = .82;

  function refresh() {
    if (forcedColors.matches) return;
    const style = getComputedStyle(pattern);
    const font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const { clientWidth: width, clientHeight: height } = background;
    const radius = Math.min(205, Math.max(140, width * .16));
    const size = Math.ceil(2 * (radius + 50));
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    const pixels = Math.ceil(size * scale);
    if (canvas.width !== pixels || canvas.height !== pixels) {
      canvas.width = pixels;
      canvas.height = pixels;
      canvas.style.width = canvas.style.height = size + 'px';
    }

    glyphContext.font = font;
    const digitWidth = glyphContext.measureText('0').width;
    const lineHeight = parseFloat(style.lineHeight);
    const glyphWidth = Math.ceil((digitWidth + 2) * scale);
    const glyphHeight = Math.ceil(lineHeight * scale);
    glyphs.width = glyphWidth * 2;
    glyphs.height = glyphHeight;
    glyphContext.scale(scale, scale);
    glyphContext.font = font;
    glyphContext.textBaseline = 'middle';
    glyphContext.fillStyle = getComputedStyle(layer).color;
    glyphContext.fillText('0', 1, glyphHeight / scale / 2);
    glyphContext.fillText('1', glyphWidth / scale + 1, glyphHeight / scale / 2);

    geometry = {
      width,
      height,
      centerX: width / 2,
      centerY: height / 2,
      originX: -pattern.offsetWidth / 2,
      originY: -pattern.offsetHeight / 2,
      advance: digitWidth + parseFloat(style.letterSpacing),
      lineHeight,
      glyphWidth,
      glyphHeight,
      radius,
      size,
      scale,
    };
    if (pointer) hoverDirty = true;
    if (hoverDirty || pulses.length) schedule();
  }

  function clear() {
    cancelAnimationFrame(frame);
    frame = null;
    pointer = undefined;
    press = undefined;
    leavingAt = undefined;
    hoverDirty = false;
    hoverLevel = 0;
    lastHoverFrame = undefined;
    pulses.length = 0;
    canvas.hidden = pulseCanvas.hidden = true;
  }

  function paintHover(now) {
    if (!pointer || (!hoverDirty && leavingAt === undefined)) return;
    const elapsed = leavingAt === undefined ? 0 : Math.max(0, now - leavingAt);
    const fade = Math.max(0, 1 - elapsed / 190);
    if (!fade) {
      pointer = leavingAt = undefined;
      press = undefined;
      hoverDirty = false;
      hoverLevel = 0;
      lastHoverFrame = undefined;
      canvas.hidden = true;
      return;
    }

    const distance = press && !press.held ? Math.hypot(pointer.x - press.x, pointer.y - press.y) : 0;
    const target = press ? Math.min(1, Math.max(0, (distance - 12) / (hoverReturnDistance - 12))) : 1;
    const stepTime = Math.min(42, Math.max(0, now - (lastHoverFrame ?? now)));
    lastHoverFrame = now;
    if (reducedMotion.matches) hoverLevel = target;
    else if (hoverLevel < target) hoverLevel = Math.min(target, hoverLevel + stepTime / hoverReturnDuration);
    else hoverLevel = Math.max(target, hoverLevel - stepTime / pressDuration);
    const strength = fade * hoverLevel ** 2 * (3 - 2 * hoverLevel);
    hoverDirty = hoverLevel !== target;
    canvas.hidden = strength === 0;
    if (!strength) return;

    const { centerX, centerY, radius, size, scale } = geometry;
    const canvasX = Math.round(pointer.x - size / 2);
    const canvasY = Math.round(pointer.y - size / 2);
    const radiusSquared = radius * radius;
    const lift = reducedMotion.matches ? 0 : liftHeight;

    canvas.style.transform = `translate3d(${canvasX}px, ${canvasY}px, 0)`;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.setTransform(scale, 0, 0, scale, (centerX - canvasX) * scale, (centerY - canvasY) * scale);
    context.rotate(-rotation);
    drawDigits(context, pointer, radius, (distanceSquared) => {
      const falloff = Math.max(0, 1 - distanceSquared / radiusSquared);
      return falloff * Math.sqrt(falloff) * strength;
    }, lift, hoverOpacity);
  }

  function drawDigits(target, { x, y }, reach, getInfluence, lift, opacity) {
    const { centerX, centerY, originX, originY, advance, lineHeight, glyphWidth, glyphHeight, scale } = geometry;
    const cursorX = x - centerX;
    const cursorY = y - centerY;
    const localX = cursorX * cos - cursorY * sin;
    const localY = cursorX * sin + cursorY * cos;
    const firstRow = Math.max(0, Math.floor((localY - originY - reach) / lineHeight));
    const lastRow = Math.min(patternLines.length - 1, Math.ceil((localY - originY + reach) / lineHeight));
    const firstColumn = Math.max(0, Math.floor((localX - originX - reach) / advance));
    const lastColumn = Math.ceil((localX - originX + reach) / advance);
    for (let row = firstRow; row <= lastRow; row++) {
      const line = patternLines[row];
      const y = originY + (row + .5) * lineHeight;
      for (let column = firstColumn; column <= lastColumn && column < line.length; column++) {
        const digit = line[column];
        if (digit === ' ') continue;
        const x = originX + column * advance;
        const dx = x + advance / 2 - localX;
        const dy = y - localY;
        const influence = getInfluence(dx * dx + dy * dy, dx, dy);
        if (!influence) continue;
        const rise = lift * influence;
        target.globalAlpha = opacity * Math.abs(influence);
        target.drawImage(glyphs, digit === '1' ? glyphWidth : 0, 0, glyphWidth, glyphHeight,
          x + sin * rise - 1, y - cos * rise - glyphHeight / scale / 2, glyphWidth / scale, glyphHeight / scale);
      }
    }
  }

  function paintPulses(now) {
    while (pulses.length && pulses[0].start !== null && now - pulses[0].start >= pulseDuration) pulses.shift();
    pulseCanvas.hidden = !pulses.length;
    if (!pulses.length) return;

    const { width, height, centerX, centerY } = geometry;
    const scale = Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(3000000 / (width * height)));
    const pixelWidth = Math.ceil(width * scale);
    const pixelHeight = Math.ceil(height * scale);
    if (pulseCanvas.width !== pixelWidth || pulseCanvas.height !== pixelHeight) {
      pulseCanvas.width = pixelWidth;
      pulseCanvas.height = pixelHeight;
    }
    if (pulseCanvas.style.width !== width + 'px') pulseCanvas.style.width = width + 'px';
    if (pulseCanvas.style.height !== height + 'px') pulseCanvas.style.height = height + 'px';
    pulseContext.setTransform(scale, 0, 0, scale, 0, 0);
    pulseContext.clearRect(0, 0, width, height);
    for (const pulse of pulses) {
      pulse.start ??= now;
      const progress = (now - pulse.start) / pulseDuration;
      const { band } = pulse;
      const radius = 8 + (pulse.reach + 1.5 * band) * progress;
      const strength = (1 - progress) ** .72;
      const crestWidth = .42 + .5 * Math.max(0, 1 - progress * 7);
      const ripple = Math.min(radius * .12, band * .12);
      const offsetAt = angle => ripple * (
        .78 * Math.sin(3 * angle + progress * 4) +
        .22 * Math.cos(5 * angle - progress * 6)
      );
      pulseContext.save();
      pulseContext.translate(centerX, centerY);
      pulseContext.rotate(-rotation);
      const inner = Math.max(0, radius - 1.5 * band - ripple);
      const outer = radius + crestWidth * band + ripple;
      drawDigits(pulseContext, pulse, outer, (distanceSquared, dx, dy) => {
        if (distanceSquared < inner * inner || distanceSquared > outer * outer) return 0;
        const angle = Math.atan2(dy, dx) - rotation;
        const phase = (Math.sqrt(distanceSquared) - radius - offsetAt(angle)) / band;
        const crest = Math.max(0, 1 - Math.abs(phase) / crestWidth) ** 2;
        const trough = Math.max(0, 1 - Math.abs(phase + .52) / .32) ** 2;
        const wake = Math.max(0, 1 - Math.abs(phase + 1) / .44) ** 2;
        return (crest - .65 * trough + .58 * wake) * strength;
      }, liftHeight, pulseOpacity);
      pulseContext.restore();
    }
  }

  function paint(now) {
    frame = null;
    paintPulses(now);
    paintHover(now);
    if (pulses.length || hoverDirty || leavingAt !== undefined) schedule();
  }

  function schedule() {
    if (frame === null) frame = requestAnimationFrame(paint);
  }

  const canReact = () => !forcedColors.matches && !document.hidden && toggle?.getAttribute('aria-pressed') !== 'true';

  function followPointer({ clientX, clientY }) {
    if (!canReact()) return;
    if (!geometry) refresh();
    pointer = { x: clientX, y: clientY };
    if (press && !press.held && Math.hypot(clientX - press.x, clientY - press.y) >= hoverReturnDistance) {
      press = undefined;
    }
    leavingAt = undefined;
    hoverDirty = true;
    schedule();
  }

  function fadePointer() {
    if (reducedMotion.matches) {
      pointer = undefined;
      hoverDirty = false;
      hoverLevel = 0;
      lastHoverFrame = undefined;
      canvas.hidden = true;
      return;
    }
    leavingAt = performance.now();
    schedule();
  }

  window.addEventListener('pointermove', event => {
    if (event.pointerType === 'mouse' && canHover.matches) followPointer(event);
  }, { passive: true });
  window.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || !canHover.matches ||
        !canReact() || reducedMotion.matches) return;
    press = { x: event.clientX, y: event.clientY, held: true };
    followPointer(event);
  }, { passive: true });
  window.addEventListener('pointerup', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || !press) return;
    press.held = false;
    followPointer(event);
  }, { passive: true });
  window.addEventListener('pointercancel', event => {
    if (event.pointerType !== 'mouse' || !press) return;
    press = undefined;
    followPointer(event);
  }, { passive: true });
  window.addEventListener('click', ({ clientX: x, clientY: y, detail }) => {
    if (!detail || reducedMotion.matches || !canReact()) return;
    if (!geometry) refresh();
    const { width, height } = geometry;
    if (!width || !height) return;
    const reach = Math.hypot(Math.max(x, width - x), Math.max(y, height - y));
    const band = Math.min(128, Math.max(66, width * .096));
    if (pulses.length === 3) pulses.shift();
    pulses.push({ x, y, reach, band, start: null });
    schedule();
  }, { passive: true });
  document.addEventListener('pointerout', event => {
    if (event.pointerType === 'mouse' && !event.relatedTarget && pointer && leavingAt === undefined) fadePointer();
  }, { passive: true });

  window.addEventListener('blur', clear);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clear();
  }, { passive: true });
  window.addEventListener('themechange', refresh);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      pulses.length = 0;
      press = undefined;
      pulseCanvas.hidden = true;
      if (leavingAt !== undefined) {
        pointer = leavingAt = undefined;
        hoverDirty = false;
        hoverLevel = 0;
        lastHoverFrame = undefined;
        canvas.hidden = true;
      }
    }
    if (pointer) {
      hoverDirty = true;
      schedule();
    }
  });
  forcedColors.addEventListener('change', () => forcedColors.matches ? clear() : refresh());
  if (toggle) {
    new MutationObserver(() => { if (!canReact()) clear(); }).observe(toggle, {
      attributes: true,
      attributeFilter: ['aria-pressed'],
    });
  }
  return refresh;
}

const refreshReactive = background.hasAttribute('data-reactive') ? initReactiveBackground() : null;
new ResizeObserver(() => {
  renderPattern();
  refreshReactive?.();
}).observe(background);
