const binaryTextSelector = 'h1, h2, h3, h4, p, a, button, dt, dd, label, output, #project-summary, .footer-inner > span';
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
  const words = [];
  for (const node of textNodes) {
    const run = document.createElement('span');
    run.className = 'binary-text-run';
    // Bound each overlay even for a pasted URL or unbroken text in the brief.
    for (const token of node.data.match(/\s+|\S{1,48}/gu)) {
      if (/^\s+$/u.test(token)) {
        run.append(token);
        continue;
      }

      const word = document.createElement('span');
      const overlay = document.createElement('span');
      word.className = 'binary-word';
      overlay.className = 'binary-digits';
      overlay.setAttribute('aria-hidden', 'true');
      overlay.dataset.bits = [...token].map(character => character.codePointAt(0).toString(2).padStart(8, '0')).join('');
      const characters = graphemes ? Array.from(graphemes.segment(token), part => part.segment) : [...token];
      words.push({ overlay, start: letters.length, length: characters.length });
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
  return { letters, words };
}

function renderBinaryText(state, changedWords) {
  if (!state.letters) return;
  const bitProgress = Math.max(0, Math.min(1, (state.position - typingStart) / typingDuration));
  if (bitProgress !== state.bitProgress) {
    const typed = bitProgress * state.letters.length;
    const previous = state.bitProgress * state.letters.length;
    const firstChanged = Math.min(typed, previous);
    const lastChanged = Math.max(typed, previous);
    let index = state.typingWord;
    while (index > 0 && state.words[index].start > firstChanged) index--;
    for (; index < state.words.length; index++) {
      const word = state.words[index];
      if (word.start >= lastChanged) break;
      state.typingWord = index;
      if (word.start + word.length <= firstChanged) continue;
      const progress = Math.max(0, Math.min(1, (typed - word.start) / word.length));
      word.overlay.style.setProperty('--typed-bits', `${progress * 100}%`);
    }
    state.bitProgress = bitProgress;
  }
  const decoded = Math.floor(Math.max(0, state.position) / state.duration * state.letters.length);
  for (let index = Math.min(decoded, state.decoded); index < Math.max(decoded, state.decoded); index++) {
    const letter = state.letters[index];
    letter.classList.toggle('is-decoded', index < decoded);
    changedWords.add(letter.parentElement);
  }
  state.decoded = decoded;
}

function alignDigits(changedWords) {
  // Read all character positions before changing overlay styles.
  const positions = [];
  for (const word of changedWords) {
    const next = word.querySelector('.binary-glyph:not(.is-decoded)');
    const left = next && next !== word.firstChild ? next.offsetLeft : 0;
    positions.push({ overlay: word.lastElementChild, hidden: !next, left });
  }
  for (const { overlay, hidden, left } of positions) {
    overlay.hidden = hidden;
    if (!hidden) overlay.style.left = left + 'px';
  }
}

const typingStart = -400;
const typingDuration = 340;
const revealStart = typingStart - 90;

function enableBinaryReveal() {
  const staticText = matchMedia('(prefers-reduced-motion: reduce), (forced-colors: active)');
  const texts = new Map();
  const active = new Set();
  let frame = null;
  let previousTime = null;

  function prepare(element, changedWords) {
    const state = texts.get(element);
    if (state.letters) return;
    const { letters, words } = prepareBinaryText(element);
    state.letters = letters;
    state.words = words;
    state.bitProgress = 0;
    state.typingWord = 0;
    state.decoded = 0;
    renderBinaryText(state, changedWords);
  }

  function animateTexts(time) {
    const elapsed = previousTime === null ? 0 : time - previousTime;
    previousTime = time;
    const changedWords = new Set();
    for (const state of active) {
      const end = state.visible ? state.duration : revealStart;
      if (state.visible) state.position = Math.min(end, state.position + elapsed);
      else state.position = Math.max(end, state.position - elapsed / .65);
      renderBinaryText(state, changedWords);
      if (state.position === end) active.delete(state);
    }
    alignDigits(changedWords);
    frame = active.size ? requestAnimationFrame(animateTexts) : null;
    if (frame === null) previousTime = null;
  }

  function updateVisibility(entries) {
    const changedWords = new Set();
    for (const { target, isIntersecting } of entries) {
      const state = texts.get(target);
      state.visible = isIntersecting;
      if (staticText.matches || state.position === (isIntersecting ? state.duration : revealStart)) continue;
      prepare(target, changedWords);
      active.add(state);
    }
    alignDigits(changedWords);
    if (active.size && frame === null) frame = requestAnimationFrame(animateTexts);
  }

  const pageObserver = new IntersectionObserver(updateVisibility, { rootMargin: '-90px 0px -64px 0px' });
  const viewportObserver = new IntersectionObserver(updateVisibility);
  const nearbyObserver = new IntersectionObserver(entries => {
    const changedWords = new Set();
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting || staticText.matches) continue;
      prepare(target, changedWords);
      nearbyObserver.unobserve(target);
    }
    alignDigits(changedWords);
  }, { rootMargin: '100px 0px' });

  const dynamicObserver = new MutationObserver(changes => {
    for (const { target } of changes) {
      if (target.firstElementChild?.classList.contains('binary-text-run')) continue;
      // The control supplied fresh text. Animate it on its next visibility change.
      const state = texts.get(target);
      active.delete(state);
      state.letters = null;
      state.words = null;
      state.decoded = 0;
      state.position = state.visible ? state.duration : revealStart;
    }
  });

  function syncMotionPreference() {
    if (staticText.matches) {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      previousTime = null;
      active.clear();
      return;
    }

    if (!texts.size) {
      for (const element of document.querySelectorAll(binaryTextSelector)) {
        let duration = 280;
        if (element.matches('h1, h2, h3, h4')) duration = 480;
        else if (element.matches('a, button, label, output')) duration = 160;
        texts.set(element, { duration, letters: null, position: revealStart, decoded: 0, visible: false });
        const observer = element.closest('.site-header, .site-footer, .skip-link') ? viewportObserver : pageObserver;
        observer.observe(element);
        nearbyObserver.observe(element);
        if (element.matches('#project-summary, #brief-status, #toggle-background, output')) {
          dynamicObserver.observe(element, { childList: true });
        }
      }
    }
    const changedWords = new Set();
    for (const state of texts.values()) {
      state.position = state.visible ? state.duration : revealStart;
      renderBinaryText(state, changedWords);
    }
    alignDigits(changedWords);
  }

  staticText.addEventListener('change', syncMotionPreference);
  syncMotionPreference();
}

if ('IntersectionObserver' in window) enableBinaryReveal();
