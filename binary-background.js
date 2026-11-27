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
  const hero = document.querySelector('.hero');
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return;

  canvas.hidden = true;
  background.append(canvas);
  const sin = Math.sin(rotation);
  const cos = Math.cos(rotation);
  let geometry;
  let pointer;
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

    context.font = font;
    context.textBaseline = 'middle';
    geometry = {
      centerX: width / 2,
      centerY: height / 2,
      originX: -pattern.offsetWidth / 2,
      originY: -pattern.offsetHeight / 2,
      advance: context.measureText('0').width + parseFloat(style.letterSpacing),
      lineHeight: parseFloat(style.lineHeight),
      radius,
      size,
      scale,
    };
    context.fillStyle = getComputedStyle(canvas).color;
    if (pointer) schedule();
  }

  function clear() {
    cancelAnimationFrame(frame);
    clearTimeout(releaseTimer);
    frame = null;
    pointer = undefined;
    touchId = null;
    leavingAt = undefined;
    canvas.hidden = true;
    pattern.style.removeProperty('--background-reveal-mask');
    hero?.style.removeProperty('--background-reveal-mask');
  }

  function paint(now) {
    frame = null;
    const fadeTime = pointer.touch ? 360 : 190;
    const elapsed = leavingAt === undefined ? 0 : Math.max(0, now - leavingAt);
    const strength = Math.max(0, 1 - elapsed / fadeTime);
    if (!strength) {
      clear();
      return;
    }

    const { centerX, centerY, originX, originY, advance, lineHeight, radius, size, scale } = geometry;
    const cursorX = pointer.x - centerX;
    const cursorY = pointer.y - centerY;
    const localX = cursorX * cos - cursorY * sin;
    const localY = cursorX * sin + cursorY * cos;
    const canvasX = Math.round(pointer.x - size / 2);
    const canvasY = Math.round(pointer.y - size / 2);
    const radiusSquared = radius * radius;
    const heroBox = hero?.getBoundingClientRect();
    const lift = reducedMotion.matches ? 0 : pointer.touch ? 36 : 30;
    const peakOpacity = pointer.touch ? .88 : .64;

    canvas.hidden = false;
    canvas.style.transform = `translate(${canvasX}px, ${canvasY}px)`;
    pattern.style.setProperty('--background-reveal-mask', `radial-gradient(circle ${radius}px at ${localX - originX}px ${localY - originY}px, rgb(0 0 0 / ${1 - strength}) 36%, #000 100%)`);
    if (heroBox && heroBox.bottom > 0) {
      const x = pointer.x - heroBox.left;
      const y = pointer.y - heroBox.top;
      const reveal = pointer.touch ? .9 : .78;
      hero.style.setProperty('--background-reveal-mask', `radial-gradient(circle ${radius}px at ${x}px ${y}px, rgb(0 0 0 / ${1 - reveal * strength}), #000 100%)`);
    }
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
        context.fillText(digit, x + sin * rise, y - cos * rise);
      }
    }
    if (leavingAt !== undefined) schedule();
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

  // Passive touch events let the browser scroll while keeping the effect visible under a finger.
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
  window.addEventListener('blur', clear);
  window.addEventListener('scroll', () => { if (pointer) schedule(); }, { passive: true });
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
