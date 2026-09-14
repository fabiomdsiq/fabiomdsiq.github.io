const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const filters = [...document.querySelectorAll('.filter')];
const projects = [...document.querySelectorAll('.project-row')];
const emptyState = document.querySelector('.empty-state');
const dashboardTabs = [...document.querySelectorAll('[data-dashboard-view]')];
const dashboardCapabilities = [...document.querySelectorAll('[data-capability-list] .capability')];
const dashboardTechnologies = [...document.querySelectorAll('[data-dashboard-tech] li')];
const dashboardInsight = document.querySelector('[data-dashboard-insight]');
const dashboardSection = document.querySelector('#dashboard');

const dashboardInsights = {
  geral: 'Centralize indicadores, acompanhe gargalos e transforme dados dispersos em decisões rápidas.',
  bots: 'Acompanhe conversas, aprovações, atendimentos e falhas dos seus bots e chatbots em uma única visão.',
  integracoes: 'Monitore APIs, webhooks, pagamentos e sincronizações com alertas claros para cada etapa da operação.',
  dados: 'Transforme planilhas, bancos e fontes externas em gráficos atualizados, filtros úteis e relatórios acionáveis.',
};

if (new URLSearchParams(window.location.search).get('view') === 'dashboard') {
  document.documentElement.classList.add('direct-dashboard');
  window.addEventListener('load', () => {
    setTimeout(() => dashboardSection?.scrollIntoView({ block: 'start' }), 80);
  }, { once: true });
}

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
    nav.classList.remove('is-open');
  });
});

projects.forEach((project) => {
  const summary = project.querySelector('.project-summary');
  summary?.addEventListener('click', () => {
    const wasOpen = summary.getAttribute('aria-expanded') === 'true';
    summary.setAttribute('aria-expanded', String(!wasOpen));
  });
});

filters.forEach((filterButton) => {
  filterButton.addEventListener('click', () => {
    const filter = filterButton.dataset.filter;
    filters.forEach((button) => {
      const active = button === filterButton;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    let visible = 0;
    projects.forEach((project) => {
      const categories = project.dataset.category?.split(' ') ?? [];
      const show = filter === 'todos' || categories.includes(filter);
      project.classList.toggle('is-hidden', !show);
      if (show) visible += 1;
    });
    if (emptyState) emptyState.hidden = visible !== 0;
  });
});

dashboardTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const view = tab.dataset.dashboardView;

    dashboardTabs.forEach((button) => {
      const active = button === tab;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    dashboardCapabilities.forEach((item) => {
      const focused = view === 'geral' || item.dataset.area === view;
      item.classList.toggle('is-focused', view !== 'geral' && focused);
      item.classList.toggle('is-muted', !focused);
    });

    dashboardTechnologies.forEach((item) => {
      const focused = view === 'geral' || item.dataset.area === view;
      item.classList.toggle('is-highlighted', focused);
      item.classList.toggle('is-muted', !focused);
    });

    if (dashboardInsight) dashboardInsight.textContent = dashboardInsights[view];
  });
});

document.querySelectorAll('[data-delay]').forEach((element) => {
  element.style.setProperty('--delay', `${element.dataset.delay}ms`);
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealElements = document.querySelectorAll('.reveal');

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -7% 0px' },
  );
  revealElements.forEach((element) => observer.observe(element));
}
