const binaryTextSelector = 'h1, h2, h3, h4, p, a, button, dt, dd, summary, label, output, #project-summary, .footer-inner > span';
const graphemes = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter('es') : null;

function prepareBinaryText(element) {
  const textNodes = [];
  function collectText(container) {
    for (const node of container.childNodes) {
      if (node.nodeType === Node.TEXT_NODE && /\S/u.test(node.data)) textNodes.push(node);
      if (node.nodeType === Node.ELEMENT_NODE && !node.matches(`${binaryTextSelector}, [aria-hidden="true"], .binary-text-run, input, select, textarea`)) collectText(node);
    }
  }
  collectText(element);

  const letters = [];
  for (const node of textNodes) {
    const run = document.createElement('span');
    run.className = 'binary-text-run';
    // Bound each overlay even for a pasted URL or unbroken text in the brief.
    for (const token of node.data.match(/\s+|\S{1,48}/gu)) {
      if (!/[\p{L}\p{N}]/u.test(token)) {
        run.append(token);
        continue;
      }

      const word = document.createElement('span');
      const overlay = document.createElement('span');
      word.className = 'binary-word';
      overlay.className = 'binary-digits';
      overlay.setAttribute('aria-hidden', 'true');
      // Zero-width breaks wrap surplus digits onto a second, clipped line.
      const bits = [...token].map(character => character.codePointAt(0).toString(2).padStart(8, '0')).join('');
      overlay.dataset.bits = [...bits].join('\u200b');
      const characters = graphemes ? Array.from(graphemes.segment(token), part => part.segment) : [...token];
      for (const character of characters) {
        const letter = document.createElement('span');
        letter.className = 'binary-glyph';
        letter.textContent = character;
        word.append(letter);
        letters.push(letter);
      }
      word.append(overlay);
      run.append(word);
    }
    node.replaceWith(run);
  }
  return letters;
}

function renderBinaryText(state) {
  const decoded = Math.floor(state.progress * state.letters.length);
  const changedWords = new Set();
  for (let index = Math.min(decoded, state.decoded); index < Math.max(decoded, state.decoded); index++) {
    const letter = state.letters[index];
    letter.classList.toggle('is-decoded', index < decoded);
    changedWords.add(letter.parentElement);
  }
  for (const word of changedWords) {
    const next = word.querySelector('.binary-glyph:not(.is-decoded)');
    const overlay = word.lastElementChild;
    overlay.hidden = !next;
    if (next) overlay.style.left = next === word.firstChild ? '0' : `${next.offsetLeft}px`;
  }
  state.decoded = decoded;
}

if ('IntersectionObserver' in window) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const texts = new Map();
  const active = new Set();
  let frame = null;
  let previousTime = null;

  function animateTexts(time) {
    const elapsed = previousTime === null ? 0 : time - previousTime;
    previousTime = time;
    for (const state of active) {
      if (state.visible) state.progress = Math.min(1, state.progress + elapsed / state.duration);
      else state.progress = Math.max(0, state.progress - elapsed / (state.duration * .65));
      renderBinaryText(state);

      if (state.progress === Number(state.visible)) active.delete(state);
    }
    frame = active.size ? requestAnimationFrame(animateTexts) : null;
    if (frame === null) previousTime = null;
  }

  function updateVisibility(entries) {
    for (const entry of entries) {
      const state = texts.get(entry.target);
      state.visible = entry.isIntersecting;
      if (!motion.matches && state.progress !== Number(state.visible)) active.add(state);
    }
    if (active.size && frame === null) frame = requestAnimationFrame(animateTexts);
  }

  const pageObserver = new IntersectionObserver(updateVisibility, { rootMargin: '-90px 0px -64px 0px' });
  const viewportObserver = new IntersectionObserver(updateVisibility);
  const dynamicObserver = new MutationObserver((changes) => {
    for (const element of new Set(changes.map(({ target }) => target))) {
      if (element.firstElementChild?.classList.contains('binary-text-run')) continue;
      const state = texts.get(element);
      state.letters = prepareBinaryText(element);
      state.progress = Number(state.visible);
      state.decoded = 0;
      renderBinaryText(state);
    }
  });

  function syncMotionPreference() {
    if (motion.matches) {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      previousTime = null;
      active.clear();
      return;
    }

    for (const element of document.querySelectorAll(binaryTextSelector)) {
      if (texts.has(element) || element.closest('.binary-background')) continue;
      const duration = element.matches('h1, h2, h3, h4') ? 480 : element.matches('a, button, label, output') ? 160 : 280;
      texts.set(element, { duration, letters: prepareBinaryText(element), progress: 0, decoded: 0, visible: false });
      const observer = element.closest('.site-header, .site-footer, .skip-link') ? viewportObserver : pageObserver;
      observer.observe(element);
      if (element.matches('#project-summary, #brief-status, #toggle-background, output')) {
        dynamicObserver.observe(element, { childList: true });
      }
    }
    for (const state of texts.values()) {
      state.progress = Number(state.visible);
      renderBinaryText(state);
    }
  }

  motion.addEventListener('change', syncMotionPreference);
  syncMotionPreference();
}
