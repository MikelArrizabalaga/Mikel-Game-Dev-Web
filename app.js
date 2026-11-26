function initServiceTabs() {
  const serviceOptions = document.querySelector('.service-options');
  const serviceTabs = [...serviceOptions.querySelectorAll('button')];
  const servicePanels = serviceTabs.map((tab) => document.getElementById('service-' + tab.dataset.service));
  const compactTabs = matchMedia('(max-width: 640px)');

  function selectService(index) {
    serviceTabs.forEach((tab, position) => {
      const selected = position === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      servicePanels[position].hidden = !selected;
    });
  }

  function setTabOrientation() {
    serviceOptions.setAttribute('aria-orientation', compactTabs.matches ? 'horizontal' : 'vertical');
  }

  serviceOptions.setAttribute('role', 'tablist');
  serviceOptions.setAttribute('aria-label', 'Servicios disponibles');
  setTabOrientation();
  compactTabs.addEventListener('change', setTabOrientation);

  serviceTabs.forEach((tab, index) => {
    const panel = servicePanels[index];
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panel.id);
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
    tab.addEventListener('click', () => selectService(index));
    tab.addEventListener('keydown', (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const verticalStep = compactTabs.matches ? 2 : 1;
      const offsets = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -verticalStep, ArrowDown: verticalStep };
      let next;
      if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = serviceTabs.length - 1;
      else if (Object.hasOwn(offsets, event.key)) {
        next = (index + offsets[event.key] + serviceTabs.length) % serviceTabs.length;
      } else return;
      event.preventDefault();
      selectService(next);
      serviceTabs[next].focus();
    });
  });
  selectService(0);
}

function initProjectBrief() {
  const form = document.querySelector('#project-form');
  const { service, phase, description } = form.elements;
  const summary = document.querySelector('#project-summary');
  const emailLink = document.querySelector('#email-brief');
  const recipient = emailLink.getAttribute('href');
  const feedback = document.querySelector('#brief-status');
  const copyButton = document.querySelector('#copy-brief');

  function updateSummary() {
    const serviceName = service.selectedOptions[0].textContent;
    const phaseName = phase.selectedOptions[0].textContent;
    const details = description.value.trim();
    const lines = [];
    if (service.value) lines.push('Servicio: ' + serviceName);
    if (phase.value) lines.push('Fase: ' + phaseName);
    if (details) {
      if (lines.length) lines.push('');
      lines.push('Qué necesito', details);
    }
    summary.textContent = lines.join('\n') || 'El resumen aparecerá al completar los campos.';
    copyButton.disabled = !lines.length;
    const emailBody = ['Hola Mikel,', '', ...lines].join('\n').replaceAll('\n', '\r\n');
    emailLink.href = recipient + '?subject=' + encodeURIComponent('Consulta sobre un proyecto') +
      '&body=' + encodeURIComponent(emailBody);
    feedback.textContent = '';
  }

  form.addEventListener('submit', (event) => event.preventDefault());
  form.addEventListener('input', updateSummary);
  form.addEventListener('change', updateSummary);
  updateSummary();

  for (const link of document.querySelectorAll('[data-brief-service]')) {
    link.addEventListener('click', (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      service.value = link.dataset.briefService;
      updateSummary();
    });
  }

  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(summary.textContent);
      feedback.textContent = 'Resumen copiado.';
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(summary);
      selection.removeAllRanges();
      selection.addRange(range);
      feedback.textContent = 'Resumen seleccionado. Usa la opción Copiar de tu dispositivo.';
    }
  });
}

function initNavigation() {
  const navLinks = document.querySelectorAll('.site-header nav a');
  function updateNavigation() {
    for (const link of navLinks) {
      if (link.hash === location.hash) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }
  window.addEventListener('hashchange', updateNavigation);
  updateNavigation();
}

function initHeroTyping() {
  const mark = document.querySelector('.hero-mark');
  const output = mark.querySelector('.hero-code-text');
  const messages = ['player.jump()', 'shader.set("glow", 1)', 'vfx.play("impact")'];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches) return;

  let timer;
  let digitCount = 0;
  let line = 0;
  let length = 0;
  mark.dataset.length = 0;

  function typeNext() {
    if (digitCount < 2) {
      mark.dataset.length = ++digitCount;
      timer = setTimeout(typeNext, digitCount === 2 ? 750 : 140);
      return;
    }

    const message = messages[line];
    if (line === 0 && length === 0) mark.setAttribute('data-show-code', '');
    output.textContent = message.slice(0, length);
    if (length < message.length) {
      length++;
      timer = setTimeout(typeNext, 39);
    } else if (line < messages.length - 1) {
      line++;
      length = 0;
      timer = setTimeout(typeNext, 600);
    }
  }

  motion.addEventListener('change', () => {
    if (!motion.matches) return;
    clearTimeout(timer);
    delete mark.dataset.length;
    mark.removeAttribute('data-show-code');
  });
  timer = setTimeout(typeNext, 90);
}

initServiceTabs();
initProjectBrief();
initNavigation();
initHeroTyping();
document.querySelectorAll('[data-needs-js]').forEach((element) => { element.hidden = false; });
