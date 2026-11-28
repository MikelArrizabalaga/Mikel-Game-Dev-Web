const binaryTextSelector = [
  'h1', 'h2', 'h3', 'h4', 'p', 'a', 'button', 'dt', 'dd', 'label', 'output',
  '.category-label', '.contact-address', '.hero-message-decoded',
].join(', ');

const graphemes = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter(document.documentElement.lang) : null;

function measureBinaryText(element) {
  const letters = [];
  const lines = [];
  const decorative = element.matches('.hero-message-decoded');
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      const nestedText = parent.closest(binaryTextSelector);
      if (!node.data.trim() || nestedText !== element ||
          (!decorative && parent.closest('[aria-hidden="true"]'))) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const fontSize = parseFloat(getComputedStyle(node.parentElement).fontSize);
    const characters = graphemes ? Array.from(graphemes.segment(node.data), ({ segment }) => segment) : [...node.data];
    let offset = 0;
    let line;
    for (const character of characters) {
      const start = offset;
      offset += character.length;
      if (!character.trim()) continue;

      const range = new Range();
      range.setStart(node, start);
      range.setEnd(node, offset);
      const rect = range.getBoundingClientRect();
      if (!rect.width || !rect.height) continue;
      if (!line || line.top !== rect.top) {
        line = { top: rect.top, left: rect.left, right: rect.right, height: rect.height, fontSize, start: letters.length, bits: '' };
        lines.push(line);
      }
      line.right = Math.max(line.right, rect.right);
      line.bits += Array.from(character, char => char.codePointAt(0).toString(2).padStart(8, '0')).join('');
      line.end = letters.length + 1;
      letters.push({ range, left: rect.left });
    }
  }
  return { letters, lines };
}

function initHeroMessages(canAnimate, replaceMessage) {
  const message = document.querySelector('.hero-message-decoded');
  if (!message) return () => {};
  const mark = message.closest('.hero-mark');
  const messages = [message.textContent, message.dataset.heroEffects, message.dataset.heroCollaboration];
  const cycleDuration = 2300;
  mark.style.setProperty('--hero-cycle-duration', cycleDuration + 'ms');
  let index = 0;
  let visible = false;
  let timer;

  function sync() {
    clearInterval(timer);
    const active = visible && !document.hidden && canAnimate();
    mark.toggleAttribute('data-cycle', active);
    if (!active) return;
    timer = setInterval(() => {
      index = (index + 1) % messages.length;
      replaceMessage(message, messages[index]);
    }, cycleDuration);
  }

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  observer.observe(message);
  document.addEventListener('visibilitychange', sync);
  return sync;
}

function enableBinaryReveal() {
  const staticText = matchMedia('(prefers-reduced-motion: reduce), (forced-colors: active)');
  const toggle = document.querySelector('#toggle-animation');
  const header = document.querySelector('.site-header');
  const main = document.querySelector('main');
  const pending = CSS.highlights && typeof Highlight === 'function' ? new Highlight() : null;
  const visible = new Set();
  const effects = new Map();
  let paused = false;
  let frame = null;
  let observer;
  let headerHeight;
  let viewportWidth = document.documentElement.clientWidth;
  const canAnimate = () => !paused && !staticText.matches;
  const syncHero = initHeroMessages(canAnimate, (message, text) => {
    finish(message);
    message.textContent = text;
    if (pending && visible.has(message)) enter([message], true);
  });

  function finish(element) {
    const effect = effects.get(element);
    if (!effect) return;
    for (const { range } of effect.letters) pending.delete(range);
    for (const { overlay } of effect.lines) overlay.remove();
    effects.delete(element);
  }

  function clearEffects() {
    for (const element of effects.keys()) finish(element);
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
  }

  function update(now) {
    frame = null;
    const blankDuration = 45;
    const writingDuration = 185;
    for (const [element, effect] of effects) {
      const elapsed = now - effect.started;
      const written = Math.max(0, Math.min(1, (elapsed - blankDuration) / writingDuration));
      const decoding = Math.max(0, (elapsed - blankDuration - writingDuration) / 240);
      if (decoding >= 1) {
        finish(element);
        continue;
      }

      const decoded = Math.floor(decoding * effect.letters.length);
      for (let i = effect.decoded; i < decoded; i++) pending.delete(effect.letters[i].range);
      for (const { left, end, start, overlay } of effect.lines) {
        if (decoded >= end && effect.decoded < end) overlay.hidden = true;
        if (written !== effect.written) overlay.style.setProperty('--binary-written', written * 100 + '%');
        if (decoded !== effect.decoded && decoded > start && decoded < end) {
          overlay.style.setProperty('--binary-cut', Math.max(0, effect.letters[decoded].left - left) + 'px');
        }
      }
      effect.decoded = decoded;
      effect.written = written;
    }
    if (effects.size) frame = requestAnimationFrame(update);
  }

  function enter(elements, replay = false) {
    const measurements = new Map();
    for (const element of elements) {
      if (!replay && visible.has(element)) continue;
      visible.add(element);
      if (!canAnimate() || document.hidden || element.matches(':focus-within')) continue;
      // These elements are already moving as part of the opening animation.
      if (element.matches('.hero[data-intro] :is(.eyebrow, h1)')) continue;
      const measured = measureBinaryText(element);
      if (measured.letters.length) measurements.set(element, measured);
    }
    if (!measurements.size) return;

    const bodyBox = document.body.getBoundingClientRect();
    const fragment = document.createDocumentFragment();
    for (const [element, measured] of measurements) {
      const inverse = element.closest('.button-primary');
      for (const line of measured.lines) {
        const overlay = document.createElement('span');
        overlay.className = inverse ? 'binary-line binary-line-inverse' : 'binary-line';
        overlay.setAttribute('aria-hidden', 'true');
        overlay.textContent = line.bits;
        overlay.style.left = line.left - bodyBox.left + 'px';
        overlay.style.top = line.top - bodyBox.top + line.height / 2 + 'px';
        overlay.style.setProperty('--binary-width', line.right - line.left + 'px');
        overlay.style.fontSize = line.fontSize * .83 + 'px';
        line.overlay = overlay;
        fragment.append(overlay);
      }
      for (const { range } of measured.letters) pending.add(range);
      effects.set(element, { ...measured, started: performance.now(), decoded: 0, written: 0 });
    }
    document.body.append(fragment);
    if (frame === null) frame = requestAnimationFrame(update);
  }

  function sync() {
    toggle.hidden = staticText.matches;
    if (!canAnimate()) clearEffects();
    syncHero();
  }

  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.setAttribute('aria-pressed', String(paused));
    sync();
  });
  staticText.addEventListener('change', sync);
  if (pending) {
    CSS.highlights.set('binary-pending', pending);
    const elements = [...main.querySelectorAll(binaryTextSelector)].filter(element =>
      element.matches('.hero-message-decoded') || !element.closest('[aria-hidden="true"], [role="status"]')
    );

    function observeViewport() {
      const height = getComputedStyle(header).position === 'sticky' ? header.offsetHeight : 0;
      if (height === headerHeight) return;
      headerHeight = height;
      observer?.disconnect();
      observer = new IntersectionObserver(entries => {
        const entering = [];
        for (const { target, isIntersecting } of entries) {
          if (isIntersecting) entering.push(target);
          else {
            visible.delete(target);
            finish(target);
          }
        }
        enter(entering);
      }, { rootMargin: '-' + height + 'px 0px 0px' });
      for (const element of elements) observer.observe(element);
    }

    // Prepare texts already on screen before the observer delivers its first entries.
    const viewportHeight = document.documentElement.clientHeight;
    observeViewport();
    enter(elements.filter(element => {
      const rect = element.getBoundingClientRect();
      return rect.width && rect.bottom > headerHeight && rect.top < viewportHeight;
    }));

    window.addEventListener('resize', () => {
      const width = document.documentElement.clientWidth;
      if (width !== viewportWidth) {
        viewportWidth = width;
        clearEffects();
      }
      observeViewport();
    }, { passive: true });
    new ResizeObserver(observeViewport).observe(header);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) clearEffects();
    });
    document.addEventListener('focusin', () => {
      for (const element of effects.keys()) {
        if (element.matches(':focus-within')) finish(element);
      }
    });
  }
  sync();
}

if ('IntersectionObserver' in window) enableBinaryReveal();
