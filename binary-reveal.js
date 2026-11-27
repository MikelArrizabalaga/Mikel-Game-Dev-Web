const binaryTextSelector = [
  'h1', 'h2', 'h3', 'h4', 'p', 'a', 'button', 'dt', 'dd', 'label', 'output',
  '.category-label',
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
  const decoded = mark.querySelector('.hero-message-decoded');
  const encoded = mark.querySelector('.hero-message-bits');
  const messages = [decoded.textContent, 'En shaders y VFX', 'En el trato cercano'];
  let timer;
  let visible = false;
  let running = false;
  let index = 0;

  function holdMessage() {
    decoded.textContent = messages[index];
    encoded.textContent = '';
    mark.dataset.phase = 'resolved';
    if (running) timer = setTimeout(fadeMessage, 2300);
  }

  function fadeMessage() {
    mark.dataset.phase = 'leaving';
    timer = setTimeout(() => {
      index = (index + 1) % messages.length;
      revealMessage();
    }, 220);
  }

  function revealMessage() {
    const message = messages[index];
    const bits = Array.from(message, (character, position) => {
      return character === ' ' ? ' ' : (character.codePointAt(0) + position) % 2;
    }).join('');
    let length = 0;
    decoded.textContent = '';
    encoded.textContent = bits;
    mark.dataset.phase = 'binary';

    function decode() {
      length++;
      decoded.textContent = message.slice(0, length);
      encoded.textContent = bits.slice(length);
      if (length < message.length) timer = setTimeout(decode, 22);
      else holdMessage();
    }
    timer = setTimeout(decode, 115);
  }

  function sync() {
    const active = visible && !document.hidden && canAnimate();
    if (active === running) return;
    running = active;
    clearTimeout(timer);
    holdMessage();
  }

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && entry.intersectionRatio >= .35;
    sync();
  }, { threshold: .35 });
  observer.observe(mark);
  document.addEventListener('visibilitychange', sync);
  return sync;
}

function enableBinaryReveal() {
  const staticText = matchMedia('(prefers-reduced-motion: reduce), (forced-colors: active)');
  const touchScroll = matchMedia('(pointer: coarse)');
  const hasScrollEnd = 'onscrollend' in document;
  const toggle = document.querySelector('#toggle-animation');
  const pending = CSS.highlights && typeof Highlight === 'function' ? new Highlight() : null;
  if (pending) CSS.highlights.set('binary-pending', pending);
  const header = document.querySelector('.site-header');
  const visible = new Set();
  const focusedText = new Set();
  const effects = new Map();
  let paused = false;
  let scrolling = false;
  let scrollEndTimer;
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
    for (const line of lines) {
      const { start, end, left, overlay } = line;
      const hidden = count >= end;
      if (overlay.hidden !== hidden) overlay.hidden = hidden;
      const cut = count > start && count < end ? Math.max(0, letters[count].left - left) : 0;
      if (line.cut !== cut) {
        line.cut = cut;
        overlay.style.setProperty('--binary-cut', cut + 'px');
      }
    }
    effect.decoded = count;
  }

  function schedule() {
    if (frame === null && !scrolling && !document.hidden && canAnimate()) frame = requestAnimationFrame(update);
  }

  function update(now) {
    frame = null;
    if (!pending || scrolling || document.hidden || !canAnimate()) return;
    const height = document.documentElement.clientHeight;
    const headerBottom = header.getBoundingClientRect().bottom;
    const inset = Math.max(0, height - headerBottom) * .15;
    const focusTop = headerBottom + inset;
    const focusBottom = height - inset;
    const bodyBox = document.body.getBoundingClientRect();
    const changes = [];
    for (const element of visible) {
      const rect = element.getBoundingClientRect();
      const inView = rect.bottom > headerBottom && rect.top < height && getComputedStyle(element).visibility === 'visible';
      const engaged = element.matches(':focus-within') || !!element.closest('a:hover, button:hover, label:focus-within');
      const center = (rect.top + rect.bottom) / 2;
      // Keep the text decoded through small movements around a focus boundary.
      const buffer = focusedText.has(element) ? 12 : 0;
      const focused = (center >= focusTop - buffer && center <= focusBottom + buffer) ||
        (rect.height > focusBottom - focusTop && rect.bottom > focusTop && rect.top < focusBottom);
      const previous = effects.get(element);
      const measured = !previous && inView && !focused && !engaged ? measureBinaryText(element) : null;
      changes.push({ element, inView, engaged, focused, previous, measured });
    }

    function fadeLine(line) {
      const top = line.pageTop + bodyBox.top;
      const distance = Math.min(top + line.height - headerBottom, height - top);
      const opacity = Math.max(0, Math.min(1, distance / 44));
      if (line.opacity !== opacity) {
        line.opacity = opacity;
        line.overlay.style.opacity = opacity;
      }
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
          line.pageTop = line.top - bodyBox.top;
          overlay.style.top = line.pageTop + line.height / 2 + 'px';
          overlay.style.setProperty('--binary-width', line.right - line.left + 'px');
          overlay.style.fontSize = line.fontSize * .83 + 'px';
          line.overlay = overlay;
          fadeLine(line);
          fragment.append(overlay);
        }
        document.body.append(fragment);
        const effect = { ...measured, decoded: -1, progress: wasFocused ? 1 : 0, time: now, focused };
        effects.set(element, effect);
        render(effect, wasFocused ? measured.letters.length : 0);
        if (wasFocused) moving = true;
        continue;
      }

      for (const line of previous.lines) fadeLine(line);
      const elapsed = previous.focused === focused ? now - previous.time : 0;
      previous.time = now;
      previous.focused = focused;
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

  function finishScroll() {
    if (!scrolling) return;
    scrolling = false;
    schedule();
  }

  function onScroll() {
    if (!touchScroll.matches) {
      schedule();
      return;
    }
    if (!scrolling) {
      scrolling = true;
      clearEffects();
    }
    if (!hasScrollEnd) {
      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(finishScroll, 120);
    }
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
        if (!element.closest('[data-binary-static], .site-header, .site-footer, .skip-link, [aria-hidden="true"], [role="status"]')) observer.observe(element);
      }
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    if (hasScrollEnd) document.addEventListener('scrollend', finishScroll);
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
    for (const element of document.querySelectorAll('output')) {
      dynamicText.observe(element, { childList: true });
    }
    document.addEventListener('visibilitychange', schedule);
    for (const event of ['focusin', 'focusout', 'pointerover', 'pointerout', 'change']) {
      document.addEventListener(event, schedule);
    }
  }
  sync();
}

if ('IntersectionObserver' in window) enableBinaryReveal();
