const binaryTextSelector = [
  'h1', 'h2', 'h3', 'h4', 'p', 'a', 'button', 'dt', 'dd', 'label', 'output',
  '#project-summary', '.footer-inner > span', '.category-label',
].join(', ');

const graphemes = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter('es') : null;

function measureBinaryText(element) {
  const letters = [];
  const lines = [];
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
  const pending = CSS.highlights && typeof Highlight === 'function' ? new Highlight() : null;
  if (pending) CSS.highlights.set('binary-pending', pending);
  const visible = new Set();
  const focusedText = new Set();
  const effects = new Map();
  let paused = false;
  let frame = null;
  const canAnimate = () => !paused && !staticText.matches;
  const syncHeroTyping = initHeroTyping(canAnimate);

  function discard(element) {
    const effect = effects.get(element);
    if (!effect) return;
    for (const { range } of effect.letters) pending.delete(range);
    for (const { overlay } of effect.lines) overlay.remove();
    effects.delete(element);
  }

  function render(effect, count) {
    if (count === effect.decoded) return;
    const { letters, lines } = effect;
    const before = effect.decoded < 0 ? letters.length : effect.decoded;
    for (let i = Math.min(count, before); i < Math.max(count, before); i++) {
      if (i < count) pending.delete(letters[i].range);
      else pending.add(letters[i].range);
    }
    for (const { start, end, left, overlay } of lines) {
      overlay.hidden = count >= end;
      const cut = count > start && count < end ? letters[count].left - left : 0;
      overlay.style.setProperty('--binary-cut', Math.max(0, cut) + 'px');
    }
    effect.decoded = count;
  }

  function schedule() {
    if (frame === null) frame = requestAnimationFrame(update);
  }

  function update(now) {
    frame = null;
    if (!pending || !canAnimate()) return;
    const height = document.documentElement.clientHeight;
    const headerBottom = document.querySelector('.site-header').getBoundingClientRect().bottom;
    const inset = Math.max(0, height - headerBottom) * .15;
    const focusTop = headerBottom + inset;
    const focusBottom = height - inset;
    const bodyBox = document.body.getBoundingClientRect();
    const changes = [];
    for (const element of visible) {
      const rect = element.getBoundingClientRect();
      const inView = rect.bottom > headerBottom && rect.top < height && getComputedStyle(element).visibility === 'visible';
      const engaged = element.matches(':focus-within, a:hover, button:hover');
      const center = (rect.top + rect.bottom) / 2;
      const focused = (center >= focusTop && center <= focusBottom) ||
        (rect.height > focusBottom - focusTop && rect.bottom > focusTop && rect.top < focusBottom);
      const previous = effects.get(element);
      const measured = !previous && inView && !focused ? measureBinaryText(element) : null;
      changes.push({ element, inView, engaged, focused, previous, measured });
    }

    let moving = false;
    for (const { element, inView, engaged, focused, previous, measured } of changes) {
      const wasFocused = focusedText.has(element);
      if (inView && (engaged || focused)) focusedText.add(element);
      else focusedText.delete(element);
      if (!inView || engaged) {
        discard(element);
        continue;
      }
      if (!previous) {
        if (!measured?.letters.length) continue;
        const fragment = document.createDocumentFragment();
        for (const line of measured.lines) {
          const overlay = document.createElement('span');
          overlay.className = element.closest('.button-primary') ? 'binary-line binary-line-inverse' : 'binary-line';
          overlay.setAttribute('aria-hidden', 'true');
          overlay.textContent = line.bits;
          overlay.style.left = line.left - bodyBox.left + 'px';
          overlay.style.top = line.top - bodyBox.top + line.height / 2 + 'px';
          overlay.style.setProperty('--binary-width', line.right - line.left + 'px');
          overlay.style.fontSize = line.fontSize * .83 + 'px';
          fragment.append(overlay);
          line.overlay = overlay;
        }
        document.body.append(fragment);
        const effect = { ...measured, decoded: -1, progress: wasFocused ? 1 : 0, time: now };
        effects.set(element, effect);
        render(effect, wasFocused ? measured.letters.length : 0);
        if (wasFocused) moving = true;
        continue;
      }

      const elapsed = Math.min(now - previous.time, 60);
      previous.time = now;
      const duration = element.matches('h1, h2, h3, h4') ? 220 : 150;
      const direction = focused ? 1 : -1;
      previous.progress = Math.max(0, Math.min(1, previous.progress + direction * elapsed / duration));
      render(previous, Math.floor(previous.progress * previous.letters.length));
      if (focused && previous.progress === 1) discard(element);
      else if (previous.progress > 0 || focused) moving = true;
    }
    if (moving) schedule();
  }

  const observer = new IntersectionObserver(entries => {
    for (const { target, isIntersecting } of entries) {
      if (isIntersecting) visible.add(target);
      else {
        visible.delete(target);
        focusedText.delete(target);
        discard(target);
      }
    }
    schedule();
  });

  function clearEffects() {
    for (const element of effects.keys()) discard(element);
    focusedText.clear();
  }

  function sync() {
    toggle.hidden = staticText.matches;
    if (canAnimate()) schedule();
    else clearEffects();
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
        if (!element.closest('.site-header, .skip-link, [aria-hidden="true"], [role="status"]')) observer.observe(element);
      }
    });
    window.addEventListener('scroll', schedule, { passive: true });
    const refreshLayout = () => {
      clearEffects();
      schedule();
    };
    window.addEventListener('resize', refreshLayout, { passive: true });
    new ResizeObserver(refreshLayout).observe(document.querySelector('main'));
    const dynamicText = new MutationObserver(entries => {
      for (const { target } of entries) discard(target);
      schedule();
    });
    for (const element of document.querySelectorAll('#project-summary, output')) {
      dynamicText.observe(element, { childList: true });
    }
    for (const event of ['focusin', 'focusout', 'pointerover', 'pointerout', 'change']) {
      document.addEventListener(event, schedule);
    }
  }
  sync();
}

if ('IntersectionObserver' in window) enableBinaryReveal();
