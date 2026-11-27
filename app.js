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

function initNavigation() {
  const header = document.querySelector('.site-header');
  function updateHeaderHeight() {
    document.documentElement.style.setProperty('--header-height', header.offsetHeight + 'px');
  }
  updateHeaderHeight();
  new ResizeObserver(updateHeaderHeight).observe(header);

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

  const navLinks = header.querySelectorAll('.main-nav a[href^="#"], .main-nav a[href="proyectos.html"]');
  const entries = new Map([...navLinks].map((link) => [link.hash.slice(1) || 'trabajos', link]));
  const sections = [...document.querySelectorAll('main > section')];
  let activeLink;
  let frame = null;
  function updateNavigation() {
    frame = null;
    const boundary = header.getBoundingClientRect().bottom + 34;
    const current = sections.findLast((section) => section.getBoundingClientRect().top <= boundary);
    const nextLink = entries.get(current?.id);
    if (activeLink === nextLink) return;
    activeLink?.removeAttribute('aria-current');
    nextLink?.setAttribute('aria-current', 'location');
    activeLink = nextLink;
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
initNavigation();
document.querySelectorAll('[data-needs-js]').forEach((element) => { element.hidden = false; });
