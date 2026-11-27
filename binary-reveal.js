const binaryTextSelector = [
  'h1', 'h2', 'h3', 'h4', 'p', 'a', 'button', 'dt', 'dd', 'label', 'output',
  '#project-summary', '.footer-inner > span', '.category-label',
].join(', ');

const graphemes = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter('es') : null;

function prepareBinaryText(element) {
  const runs = [];
  const letters = [];

  function wrapText(container) {
    for (const node of [...container.childNodes]) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (!node.matches(binaryTextSelector + ', [aria-hidden="true"], input, select, textarea')) wrapText(node);
        continue;
      }
      if (node.nodeType !== Node.TEXT_NODE || !node.data.trim()) continue;

      const run = document.createElement('span');
      const original = document.createElement('span');
      const copy = document.createElement('span');
      original.className = 'binary-original';
      copy.setAttribute('aria-hidden', 'true');
      const characters = graphemes ? Array.from(graphemes.segment(node.data), ({ segment }) => segment) : [...node.data];
      for (const character of characters) {
        if (/^\s+$/u.test(character)) {
          copy.append(character);
          continue;
        }
        const letter = document.createElement('span');
        const glyph = document.createElement('span');
        letter.className = 'binary-letter';
        letter.dataset.bit = String(character.codePointAt(0) % 2);
        glyph.className = 'binary-glyph';
        glyph.textContent = character;
        letter.append(glyph);
        copy.append(letter);
        letters.push(letter);
      }

      node.replaceWith(run);
      original.append(node);
      run.append(original, copy);
      runs.push({ run, node });
    }
  }
  wrapText(element);
  return { runs, letters };
}

function initHeroTyping(canAnimate) {
  const mark = document.querySelector('.hero-mark');
  if (!mark) return () => {};
  const output = mark.querySelector('.hero-message');
  const messages = [output.textContent, 'En shaders y VFX', 'En el trato cercano'];
  let timer;
  let visible = false;
  let line = 0;
  let length = messages[0].length;

  function nextCharacter() {
    const message = messages[line];
    if (length === message.length) {
      line = (line + 1) % messages.length;
      length = 0;
    }
    const current = messages[line];
    output.textContent = current.slice(0, ++length);
    timer = setTimeout(nextCharacter, length === current.length ? 1350 : 34);
  }

  function sync() {
    clearTimeout(timer);
    const running = canAnimate() && visible && !document.hidden;
    mark.toggleAttribute('data-typing', running);
    if (running) {
      timer = setTimeout(nextCharacter, length === messages[line].length ? 1350 : 34);
    } else {
      output.textContent = messages[line];
      length = messages[line].length;
    }
  }

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  observer.observe(mark);
  document.addEventListener('visibilitychange', sync);
  return sync;
}

function enableBinaryReveal() {
  const staticText = matchMedia('(prefers-reduced-motion: reduce), (forced-colors: active)');
  const toggle = document.querySelector('#toggle-animation');
  const completed = new WeakSet();
  const animations = new Map();
  let paused = false;
  const canAnimate = () => !paused && !staticText.matches;
  const syncHeroTyping = initHeroTyping(canAnimate);

  function finish(element) {
    const animation = animations.get(element);
    if (!animation) return;
    clearTimeout(animation.timeout);
    for (const { run, node } of animation.runs) {
      if (run.parentNode) run.replaceWith(node);
    }
    animations.delete(element);
  }

  const observer = new IntersectionObserver((entries) => {
    if (!canAnimate()) return;
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting || completed.has(target)) continue;
      observer.unobserve(target);
      completed.add(target);
      if (target.matches(':focus-within')) continue;

      const { runs, letters } = prepareBinaryText(target);
      if (!letters.length) continue;
      const maxDelay = target.matches('h1, h2') ? 420 : 600;
      const step = Math.min(44, maxDelay / Math.max(1, letters.length - 1));
      letters.forEach((letter, index) => {
        letter.style.setProperty('--letter-delay', Math.round(75 + index * step) + 'ms');
      });
      animations.set(target, { runs, timeout: setTimeout(() => finish(target), 230 + (letters.length - 1) * step) });
      letters.at(-1).firstElementChild.addEventListener('animationend', () => finish(target), { once: true });
    }
  }, { rootMargin: '0px 0px -24px' });

  function sync() {
    toggle.hidden = staticText.matches;
    observer.disconnect();
    if (canAnimate()) {
      for (const element of document.querySelectorAll(binaryTextSelector)) {
        if (!completed.has(element) && !element.closest('[aria-hidden="true"], [role="status"]')) observer.observe(element);
      }
    } else {
      for (const element of animations.keys()) finish(element);
    }
    syncHeroTyping();
  }

  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.setAttribute('aria-pressed', String(paused));
    sync();
  });
  staticText.addEventListener('change', sync);
  sync();
}

if ('IntersectionObserver' in window) enableBinaryReveal();
