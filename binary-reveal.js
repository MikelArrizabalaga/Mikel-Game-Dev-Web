const binaryTextSelector = '[data-binary-reveal]';
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

const typingStart = -260;
const typingDuration = 220;
const revealStart = typingStart - 30;

function enableBinaryReveal() {
  const staticText = matchMedia('(prefers-reduced-motion: reduce), (forced-colors: active)');
  const toggle = document.querySelector('#toggle-animation');
  const active = new Map();
  const spent = new WeakSet();
  let frame = null;
  let previousTime = null;
  let paused = false;

  function animate(time) {
    const elapsed = previousTime === null ? 0 : time - previousTime;
    previousTime = time;
    const changedWords = new Set();
    for (const [heading, state] of active) {
      state.position = Math.min(state.duration, state.position + elapsed);
      renderBinaryText(state, changedWords);
      if (state.position === state.duration) active.delete(heading);
    }
    alignDigits(changedWords);
    frame = active.size ? requestAnimationFrame(animate) : null;
    if (frame === null) previousTime = null;
  }

  const observer = new IntersectionObserver((entries) => {
    if (staticText.matches || paused) return;
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting || spent.has(target)) continue;
      observer.unobserve(target);
      spent.add(target);
      if (!target.hasAttribute('aria-label')) target.setAttribute('aria-label', target.textContent.trim());
      const { letters, words } = prepareBinaryText(target);
      active.set(target, { letters, words, position: revealStart, duration: 350, decoded: 0, bitProgress: 0, typingWord: 0 });
    }
    if (active.size && frame === null) frame = requestAnimationFrame(animate);
  }, { threshold: .8 });

  function syncObserver() {
    observer.disconnect();
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    previousTime = null;
    if (staticText.matches || paused) {
      // Keep headings legible when the animation is stopped mid-reveal.
      const changedWords = new Set();
      for (const state of active.values()) {
        state.position = state.duration;
        renderBinaryText(state, changedWords);
      }
      alignDigits(changedWords);
      active.clear();
      return;
    }

    for (const heading of document.querySelectorAll(binaryTextSelector)) {
      if (!spent.has(heading)) observer.observe(heading);
    }
  }

  function syncPreference() {
    toggle.hidden = staticText.matches;
    syncObserver();
  }

  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.setAttribute('aria-pressed', String(paused));
    syncObserver();
  });
  staticText.addEventListener('change', syncPreference);
  syncPreference();
}

if ('IntersectionObserver' in window) enableBinaryReveal();
