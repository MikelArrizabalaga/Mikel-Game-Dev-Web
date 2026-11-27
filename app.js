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

async function initProjectBrief(form) {
  const { email, service, phase, description } = form.elements;
  const summary = document.querySelector('#project-summary');
  const feedback = document.querySelector('#brief-status');
  const copyFeedback = document.querySelector('#copy-status');
  const copyButton = document.querySelector('#copy-brief');
  const sendButton = form.querySelector('button[type="submit"]');
  const localPreview = ['127.0.0.1', 'localhost'].includes(location.hostname);

  let endpoint = localPreview ? null : form.dataset.endpoint;
  if (localPreview) {
    try {
      const response = await fetch('api/encargos', { signal: AbortSignal.timeout(3000) });
      if (response.ok && (await response.json()).mode === 'local') endpoint = 'api/encargos';
    } catch {
      // The static site can still show the direct email on a different local server.
    }
  }
  if (!endpoint) return;

  function updateSummary() {
    const lines = [];
    if (email.value.trim()) lines.push('Correo: ' + email.value.trim());
    if (service.value) lines.push('Servicio: ' + service.selectedOptions[0].textContent);
    if (phase.value) lines.push('Fase: ' + phase.value);
    if (description.value.trim()) lines.push('', description.value.trim());
    summary.textContent = lines.join('\n').trim() || 'El resumen aparecerá al completar los campos.';
    copyButton.disabled = !lines.length;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sendButton.disabled) return;
    const message = description.value.trim();
    if (!message) {
      feedback.textContent = 'Describe qué necesitas.';
      description.focus();
      return;
    }

    const body = new URLSearchParams({ email: email.value.trim(), message });
    if (service.value) body.set('service', service.selectedOptions[0].textContent);
    if (phase.value) body.set('phase', phase.value);
    sendButton.disabled = true;
    feedback.textContent = 'Enviando…';
    const controls = [email, service, phase, description];
    for (const control of controls) control.disabled = true;
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body,
        signal: AbortSignal.timeout(12000),
      });
      if (!response.ok) throw new Error('Submission failed');
      form.reset();
      updateSummary();
      feedback.textContent = endpoint === 'api/encargos' ? 'Envío de prueba guardado en este equipo.' : 'Encargo enviado.';
    } catch {
      feedback.textContent = 'No se pudo enviar. Inténtalo de nuevo o usa el correo de la sección Contacto.';
    } finally {
      for (const control of controls) control.disabled = false;
      sendButton.disabled = false;
    }
  });

  form.addEventListener('input', () => {
    if (!sendButton.disabled) feedback.textContent = '';
    copyFeedback.textContent = '';
    updateSummary();
  });

  for (const link of document.querySelectorAll('[data-needs-brief]')) {
    link.hidden = false;
    link.addEventListener('click', (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || sendButton.disabled) return;
      service.value = link.dataset.briefService;
      feedback.textContent = '';
      updateSummary();
    });
  }

  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(summary.textContent);
      copyFeedback.textContent = 'Resumen copiado.';
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(summary);
      selection.removeAllRanges();
      selection.addRange(range);
      copyFeedback.textContent = 'Resumen seleccionado. Usa la opción Copiar de tu dispositivo.';
    }
  });

  document.querySelector('#brief-fallback').hidden = true;
  document.querySelector('.local-note').hidden = endpoint !== 'api/encargos';
  form.closest('.project-layout').hidden = false;
  updateSummary();
}

function initNavigation() {
  const navContact = document.querySelector('.nav-contact');
  const contactLink = navContact.firstElementChild;
  navContact.addEventListener('pointerleave', () => navContact.removeAttribute('data-dismissed'));
  navContact.addEventListener('focusout', (event) => {
    if (!navContact.contains(event.relatedTarget)) navContact.removeAttribute('data-dismissed');
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !navContact.matches(':hover, :focus-within')) return;
    if (navContact.contains(document.activeElement)) contactLink.focus();
    navContact.setAttribute('data-dismissed', '');
  });
  contactLink.addEventListener('click', () => navContact.setAttribute('data-dismissed', ''));

  if (!document.getElementById('trabajos')) return;
  const oldProjectLinks = new Set([
    'next-stop-title', 'dont-anger-title', 'shader-work-title', 'realidad-virtual', 'vr-title',
    'res-vr-title', 'previr-ctx-title', 'nutri-score-title', 'bio-tutorial-title',
    'juegos-y-aplicaciones', 'games-apps-title', 'vuela-liz-title', 'hur-title',
    'sopa-de-letras-title', 'pintxo-survivor-title', 'runner-didactico-title',
  ]);
  function forwardOldProjectLink() {
    if (oldProjectLinks.has(location.hash.slice(1))) location.replace('proyectos.html' + location.hash);
  }
  forwardOldProjectLink();
  window.addEventListener('hashchange', forwardOldProjectLink);

  const header = document.querySelector('.site-header');
  const navLinks = header.querySelectorAll('.main-nav a[href^="#"], .main-nav a[href="proyectos.html"]');
  const entries = new Map([...navLinks].map((link) => [link.hash.slice(1) || 'trabajos', link]));
  const sections = [...document.querySelectorAll('main > section')];
  let frame = null;
  function updateNavigation() {
    frame = null;
    const boundary = header.getBoundingClientRect().bottom + 34;
    const current = sections.findLast((section) => section.getBoundingClientRect().top <= boundary);
    const activeLink = entries.get(current?.id);
    for (const link of navLinks) {
      if (link === activeLink) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }
  function scheduleNavigation() {
    if (frame === null) frame = requestAnimationFrame(updateNavigation);
  }
  window.addEventListener('scroll', scheduleNavigation, { passive: true });
  window.addEventListener('resize', scheduleNavigation);
  window.addEventListener('pageshow', scheduleNavigation);
  updateNavigation();
}

if (document.querySelector('.service-options')) initServiceTabs();
const briefForm = document.querySelector('#project-form');
if (briefForm) initProjectBrief(briefForm);
initNavigation();
document.querySelectorAll('[data-needs-js]').forEach((element) => { element.hidden = false; });
