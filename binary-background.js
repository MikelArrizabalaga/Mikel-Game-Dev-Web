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
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const forcedColors = matchMedia('(forced-colors: active)');
  const toggle = document.querySelector('#toggle-animation');
  const layer = document.createElement('div');
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const glyphs = document.createElement('canvas');
  const glyphContext = glyphs.getContext('2d');
  if (!context || !glyphContext) return;

  layer.className = 'binary-wave';
  layer.setAttribute('aria-hidden', 'true');
  canvas.hidden = true;
  layer.append(canvas);
  document.body.append(layer);
  const sin = Math.sin(rotation);
  const cos = Math.cos(rotation);
  let geometry;
  let pointer;
  let position;
  let previousFrame;
  let touchId = null;
  let releaseTimer;
  let leavingAt;
  let frame = null;

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
    glyphContext.fillStyle = getComputedStyle(canvas).color;
    glyphContext.fillText('0', 1, glyphHeight / scale / 2);
    glyphContext.fillText('1', glyphWidth / scale + 1, glyphHeight / scale / 2);

    geometry = {
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
    if (pointer) schedule();
  }

  function clear() {
    cancelAnimationFrame(frame);
    clearTimeout(releaseTimer);
    frame = null;
    pointer = undefined;
    position = undefined;
    previousFrame = undefined;
    touchId = null;
    leavingAt = undefined;
    canvas.hidden = true;
  }

  function paint(now) {
    frame = null;
    const fadeTime = pointer.touch ? 360 : 190;
    const elapsed = leavingAt === undefined ? 0 : Math.max(0, now - leavingAt);
    const progress = Math.min(1, elapsed / fadeTime);
    const strength = pointer.touch ? 1 - progress * progress * (3 - 2 * progress) : 1 - progress;
    if (!strength) {
      clear();
      return;
    }

    let moving = false;
    if (!position || !pointer.touch || reducedMotion.matches) {
      position = { x: pointer.x, y: pointer.y };
    } else {
      const step = Math.min(40, Math.max(1, now - previousFrame));
      const follow = 1 - Math.exp(-step / 25);
      position.x += (pointer.x - position.x) * follow;
      position.y += (pointer.y - position.y) * follow;
      moving = Math.hypot(pointer.x - position.x, pointer.y - position.y) > .5;
      if (!moving) {
        position.x = pointer.x;
        position.y = pointer.y;
      }
    }
    previousFrame = now;

    const { centerX, centerY, originX, originY, advance, lineHeight, glyphWidth, glyphHeight, radius, size, scale } = geometry;
    const cursorX = position.x - centerX;
    const cursorY = position.y - centerY;
    const localX = cursorX * cos - cursorY * sin;
    const localY = cursorX * sin + cursorY * cos;
    const canvasX = Math.round(position.x - size / 2);
    const canvasY = Math.round(position.y - size / 2);
    const radiusSquared = radius * radius;
    const lift = reducedMotion.matches ? 0 : pointer.touch ? 36 : 30;
    const peakOpacity = pointer.touch ? .88 : .64;

    canvas.hidden = false;
    canvas.style.transform = `translate3d(${canvasX}px, ${canvasY}px, 0)`;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.setTransform(scale, 0, 0, scale, (centerX - canvasX) * scale, (centerY - canvasY) * scale);
    context.rotate(-rotation);

    const firstRow = Math.max(0, Math.floor((localY - originY - radius) / lineHeight));
    const lastRow = Math.min(patternLines.length - 1, Math.ceil((localY - originY + radius) / lineHeight));
    const firstColumn = Math.max(0, Math.floor((localX - originX - radius) / advance));
    const lastColumn = Math.ceil((localX - originX + radius) / advance);
    for (let row = firstRow; row <= lastRow; row++) {
      const line = patternLines[row];
      const y = originY + (row + .5) * lineHeight;
      for (let column = firstColumn; column <= lastColumn && column < line.length; column++) {
        const digit = line[column];
        if (digit === ' ') continue;
        const x = originX + column * advance;
        const dx = x + advance / 2 - localX;
        const dy = y - localY;
        const falloff = 1 - (dx * dx + dy * dy) / radiusSquared;
        if (falloff <= 0) continue;
        const influence = falloff * Math.sqrt(falloff) * strength;
        const rise = lift * influence;
        context.globalAlpha = peakOpacity * influence;
        context.drawImage(glyphs, digit === '1' ? glyphWidth : 0, 0, glyphWidth, glyphHeight,
          x + sin * rise - 1, y - cos * rise - glyphHeight / scale / 2, glyphWidth / scale, glyphHeight / scale);
      }
    }
    if (moving || leavingAt !== undefined) schedule();
  }

  function schedule() {
    if (frame === null) frame = requestAnimationFrame(paint);
  }

  const canReact = () => !forcedColors.matches && !document.hidden && toggle?.getAttribute('aria-pressed') !== 'true';

  function followPointer({ clientX, clientY }, touch) {
    if (!canReact()) return;
    if (!geometry) refresh();
    clearTimeout(releaseTimer);
    pointer = { x: clientX, y: clientY, touch };
    leavingAt = undefined;
    schedule();
  }

  function fadePointer() {
    if (reducedMotion.matches) {
      clear();
      return;
    }
    leavingAt = performance.now();
    schedule();
  }

  window.addEventListener('pointermove', event => {
    if (event.pointerType === 'mouse' && touchId === null) followPointer(event, false);
  }, { passive: true });
  document.addEventListener('pointerout', event => {
    if (event.pointerType === 'mouse' && !event.relatedTarget && pointer && !pointer.touch && leavingAt === undefined) fadePointer();
  }, { passive: true });

  // Touch feedback runs until the browser takes over a native scroll gesture.
  window.addEventListener('touchstart', event => {
    if (event.touches.length !== 1 || !canReact()) return;
    const touch = event.touches[0];
    touchId = touch.identifier;
    followPointer(touch, true);
  }, { passive: true });
  window.addEventListener('touchmove', event => {
    const touch = event.touches[0];
    if (event.touches.length === 1 && touch.identifier === touchId) followPointer(touch, true);
  }, { passive: true });
  function releaseTouch(event) {
    if (!Array.from(event.changedTouches).some(touch => touch.identifier === touchId)) return;
    touchId = null;
    // Give quick taps enough time to show the orange digits after the finger lifts.
    releaseTimer = setTimeout(fadePointer, reducedMotion.matches ? 430 : 280);
  }
  window.addEventListener('touchend', releaseTouch, { passive: true });
  window.addEventListener('touchcancel', releaseTouch, { passive: true });
  function clearTouchWave() {
    if (pointer?.touch) clear();
  }
  window.addEventListener('pointercancel', event => {
    if (event.pointerType === 'touch') clearTouchWave();
  }, { passive: true });
  window.addEventListener('scroll', clearTouchWave, { passive: true });
  window.addEventListener('blur', clear);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clear();
  }, { passive: true });
  window.addEventListener('themechange', refresh);
  reducedMotion.addEventListener('change', () => {
    if (leavingAt !== undefined) clear();
    else if (pointer) schedule();
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
