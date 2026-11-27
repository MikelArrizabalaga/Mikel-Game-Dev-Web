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
    const outlined = !!node.parentElement.closest('.hero-surname');
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
        letters.push({ range, rect, fontSize, outlined, bit: character.codePointAt(0) % 2 });
      }
    }
  }
  return letters;
}

function initHeroTyping(canAnimate) {
  const mark = document.querySelector('.hero-mark');
  if (!mark) return () => {};
  const output = mark.querySelector('.hero-message > span');
  const messages = [output.textContent, 'En shaders y VFX', 'En el trato cercano'];
  let timer;
  let visible = false;
  let line = 0;
  let length = messages[0].length;

  function nextCharacter() {
    const message = messages[line];
    if (length === message.length) {
      line = (line + 1) % messages.length;
      mark.dataset.message = line;
      length = 0;
    }
    const current = messages[line];
    output.textContent = current.slice(0, ++length);
    const writing = length < current.length;
    mark.toggleAttribute('data-writing', writing);
    timer = setTimeout(nextCharacter, writing ? 34 : 1900);
  }

  function sync() {
    clearTimeout(timer);
    const running = canAnimate() && visible && !document.hidden;
    mark.toggleAttribute('data-typing', running);
    mark.toggleAttribute('data-writing', running && length < messages[line].length);
    if (running) {
      timer = setTimeout(nextCharacter, length === messages[line].length ? 1900 : 34);
    } else {
      output.textContent = messages[line];
      length = messages[line].length;
    }
  }

  const observer = new IntersectionObserver(([entry]) => {
    const onScreen = entry.isIntersecting && entry.intersectionRatio >= .25;
    if (visible === onScreen) return;
    visible = onScreen;
    if (visible && canAnimate()) {
      line = 0;
      length = 0;
      mark.dataset.message = line;
      output.textContent = '';
    }
    sync();
  }, { threshold: .25 });
  observer.observe(mark);
  document.addEventListener('visibilitychange', sync);
  return sync;
}

function enableBinaryReveal() {
  const staticText = matchMedia('(prefers-reduced-motion: reduce), (forced-colors: active)');
  const toggle = document.querySelector('#toggle-animation');
  const animations = new Map();
  const pending = CSS.highlights && typeof Highlight === 'function' ? new Highlight() : null;
  const queued = pending ? new Highlight() : null;
  if (pending) {
    CSS.highlights.set('binary-queued', queued);
    CSS.highlights.set('binary-pending', pending);
  }
  let paused = false;
  let frame = null;
  const canAnimate = () => !paused && !staticText.matches;
  const syncHeroTyping = initHeroTyping(canAnimate);

  function showDigit(letter, animation) {
    const { range, rect, fontSize, bit } = letter;
    const { box, host, inverse } = animation;
    const digit = document.createElement('span');
    digit.className = 'binary-digit ' + (bit ? 'bit-one' : 'bit-zero');
    if (inverse) digit.classList.add('binary-digit-inverse');
    digit.setAttribute('aria-hidden', 'true');
    const height = fontSize * .57;
    const width = Math.min(height * .68, rect.width * .92);
    digit.style.left = rect.left - box.left + rect.width / 2 + 'px';
    digit.style.top = rect.top - box.top + rect.height / 2 + 'px';
    digit.style.width = width + 'px';
    digit.style.height = height + 'px';
    digit.style.setProperty('--bit-stroke', Math.min(height * .12, width * .25) + 'px');
    queued.delete(range);
    pending.add(range);
    host.append(digit);
    letter.digit = digit;
  }

  function reveal(letter) {
    queued.delete(letter.range);
    pending.delete(letter.range);
    letter.digit?.remove();
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
      animation.start ??= now + animation.delay;
      const elapsed = now - animation.start;
      if (elapsed < 0) continue;
      if (animation.staged === 0) {
        for (const { range, outlined } of animation.letters) {
          if (!outlined) queued.add(range);
        }
      }
      while (animation.revealed < animation.letters.length && elapsed >= 88 + animation.revealed * animation.step) {
        reveal(animation.letters[animation.revealed++]);
      }
      animation.staged = Math.max(animation.staged, animation.revealed);
      while (animation.staged < animation.letters.length && elapsed >= animation.staged * animation.step) {
        showDigit(animation.letters[animation.staged++], animation);
      }
      if (animation.revealed === animation.letters.length) animations.delete(element);
    }
    if (animations.size) frame = requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries) => {
    if (!pending || !canAnimate()) return;
    // Measure the real text once. Decorative digits never participate in text layout.
    const starts = [];
    for (const { target, isIntersecting, boundingClientRect } of entries) {
      if (!isIntersecting) {
        finish(target);
        continue;
      }
      if (animations.has(target) || target.matches(':focus-within, .skip-link') ||
          getComputedStyle(target).visibility !== 'visible') continue;
      const letters = measureBinaryText(target);
      if (!letters.length) continue;

      const host = target.closest('.site-header') || document.body;
      starts.push({
        target, letters, host, box: host.getBoundingClientRect(),
        inverse: !!target.closest('.button-primary'),
        delay: Math.min(104, Math.max(0, boundingClientRect.top) * .12),
      });
    }

    for (const { target, ...animation } of starts) {
      const { letters } = animation;
      const maxDelay = target.matches('h1, h2') ? 515 : 740;
      const step = Math.min(43, maxDelay / Math.max(1, letters.length - 1));
      animations.set(target, { ...animation, revealed: 0, staged: 0, step, start: null });
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
