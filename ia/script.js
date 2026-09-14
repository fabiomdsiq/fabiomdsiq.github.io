import { contactMessages, hubInsights } from './data.js';

const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const worldSwitch = document.querySelector('[data-world-switch]');
const hubCanvas = document.querySelector('.hub-canvas');
const hubFilters = [...document.querySelectorAll('[data-hub-filter]')];
const hubAreas = [...document.querySelectorAll('[data-hub-area]')];
const hubInsight = document.querySelector('[data-hub-insight]');
const solutionButtons = [...document.querySelectorAll('.solution-row > button')];
const whatsappOrbit = document.querySelector('[data-whatsapp-orbit]');
const contactContext = document.querySelector('[data-contact-context]');

const setHeaderState = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav?.classList.toggle('is-open', !open);
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('is-open');
  });
});

worldSwitch?.addEventListener('click', () => {
  try { localStorage.setItem('fabiomdsiq-world', 'automacoes'); } catch { /* Navegação continua sem persistência. */ }
});

hubFilters.forEach((filterButton) => {
  filterButton.addEventListener('click', () => {
    const view = filterButton.dataset.hubFilter;
    hubFilters.forEach((button) => {
      const active = button === filterButton;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    hubAreas.forEach((area) => {
      const persistent = area.dataset.hubArea === 'geral';
      const focused = view === 'geral' || persistent || area.dataset.hubArea === view;
      area.classList.toggle('is-muted', !focused);
      area.classList.toggle('is-focused', view !== 'geral' && area.dataset.hubArea === view);
    });

    if (hubCanvas) hubCanvas.dataset.active = view;
    if (hubInsight) hubInsight.textContent = hubInsights[view];
  });
});

solutionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
  });
});

requestAnimationFrame(() => whatsappOrbit?.classList.add('is-ready'));

if (whatsappOrbit && contactContext) {
  const sections = [...document.querySelectorAll('main section[id]')];
  let ticking = false;

  const updateContactContext = () => {
    const focusLine = window.innerHeight * .38;
    let active = sections.find((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= focusLine && rect.bottom > focusLine;
    });
    if (!active) {
      for (let index = sections.length - 1; index >= 0; index -= 1) {
        if (sections[index].getBoundingClientRect().top <= focusLine) {
          active = sections[index];
          break;
        }
      }
    }
    if (active && contactMessages[active.id]) contactContext.textContent = contactMessages[active.id];
    ticking = false;
  };

  const queueContactUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateContactContext);
  };

  updateContactContext();
  window.addEventListener('scroll', queueContactUpdate, { passive: true });
  window.addEventListener('resize', queueContactUpdate);
}

document.querySelectorAll('[data-delay]').forEach((element) => element.style.setProperty('--delay', `${element.dataset.delay}ms`));

const reveals = document.querySelectorAll('.reveal');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reducedMotion || !('IntersectionObserver' in window)) {
  reveals.forEach((element) => element.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .07, rootMargin: '0px 0px -6%' });
  reveals.forEach((element) => revealObserver.observe(element));
}
