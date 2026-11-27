const binaryTextSelector = [
  'h1', 'h2', 'h3', 'h4', 'p', 'a', 'button', 'dt', 'dd', 'label', 'output',
  '#project-summary', '.footer-inner > span', '.category-label',
].join(', ');

const graphemes = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter('es') : null;

function measureBinaryText(element) {
  const letters = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      const nestedText = parent.closest(binaryTextSelector);
      if (!node.data.trim() || parent.closest('[aria-hidden="true"], input, select, textarea') ||
          (nestedText !== element && element.contains(nestedText))) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const fontSize = parseFloat(getComputedStyle(node.parentElement).fontSize);
    const characters = graphemes ? Array.from(graphemes.segment(node.data), ({ segment }) => segment) : [...node.data];
    let end = 0;
    for (const character of characters) {
      const start = end;
      end += character.length;
      if (!character.trim()) continue;
      const range = new Range();
      range.setStart(node, start);
      range.setEnd(node, end);
      const rect = range.getBoundingClientRect();
      if (rect.width && rect.height) {
        letters.push({ range, rect, fontSize, bit: character.codePointAt(0) % 2 });
      }
    }
  }
  return letters;
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
  const animations = new Map();
  const pending = CSS.highlights && typeof Highlight === 'function' ? new Highlight() : null;
  if (pending) CSS.highlights.set('binary-pending', pending);
  let paused = false;
  let frame = null;
  const canAnimate = () => !paused && !staticText.matches;
  const syncHeroTyping = initHeroTyping(canAnimate);

  function reveal(letter) {
    pending.delete(letter.range);
    letter.digit.remove();
  }

  function finish(element) {
    const animation = animations.get(element);
    if (!animation) return;
    for (let i = animation.revealed; i < animation.letters.length; i++) reveal(animation.letters[i]);
    animations.delete(element);
  }

  function tick(now) {
    frame = null;
    for (const [element, animation] of animations) {
      animation.start ??= now;
      const elapsed = now - animation.start - 75;
      while (animation.revealed < animation.letters.length && elapsed >= animation.revealed * animation.step) {
        reveal(animation.letters[animation.revealed++]);
      }
      if (animation.revealed === animation.letters.length) animations.delete(element);
    }
    if (animations.size) frame = requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries) => {
    if (!pending || !canAnimate()) return;
    // Read every text rectangle before adding the decorative layer to the page.
    const starts = [];
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) {
        finish(target);
        continue;
      }
      if (animations.has(target) || target.matches(':focus-within, .skip-link')) continue;
      const letters = measureBinaryText(target);
      if (!letters.length) continue;

      const host = target.closest('.site-header') || document.body;
      starts.push({
        target, letters, host, box: host.getBoundingClientRect(),
        inverse: !!target.closest('.button-primary'),
      });
    }

    for (const { target, letters, host, box, inverse } of starts) {
      const maxDelay = target.matches('h1, h2') ? 420 : 600;
      const step = Math.min(44, maxDelay / Math.max(1, letters.length - 1));
      const layer = document.createDocumentFragment();
      for (const letter of letters) {
        const { range, rect, fontSize, bit } = letter;
        const digit = document.createElement('span');
        digit.className = 'binary-digit ' + (bit ? 'bit-one' : 'bit-zero');
        if (inverse) digit.classList.add('binary-digit-inverse');
        digit.setAttribute('aria-hidden', 'true');
        const height = fontSize * .48;
        const width = Math.min(height * .62, rect.width * .86);
        digit.style.left = rect.left - box.left + rect.width / 2 + 'px';
        digit.style.top = rect.top - box.top + rect.height / 2 + 'px';
        digit.style.width = width + 'px';
        digit.style.height = height + 'px';
        digit.style.setProperty('--bit-stroke', Math.min(height * .095, width * .23) + 'px');
        layer.append(digit);
        letter.digit = digit;
        pending.add(range);
      }
      host.append(layer);
      animations.set(target, { letters, revealed: 0, step, start: null });
    }
    if (animations.size && frame === null) frame = requestAnimationFrame(tick);
  }, { rootMargin: '0px 0px -24px' });

  window.addEventListener('resize', () => {
    for (const element of animations.keys()) finish(element);
  }, { passive: true });
  document.addEventListener('focusin', (event) => {
    for (const element of animations.keys()) {
      if (element.contains(event.target) || event.target.contains(element)) finish(element);
    }
  });

  function sync() {
    toggle.hidden = staticText.matches;
    if (!canAnimate()) {
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
  if (pending) {
    document.fonts.ready.then(() => {
      for (const element of document.querySelectorAll(binaryTextSelector)) {
        if (!element.closest('[aria-hidden="true"], [role="status"]')) observer.observe(element);
      }
    });
  }
  sync();
}

if ('IntersectionObserver' in window) enableBinaryReveal();
