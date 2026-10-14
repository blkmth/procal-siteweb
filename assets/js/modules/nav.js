/**
 * Barre de navigation : masquage au défilement, méga-menu Services,
 * panneau mobile, lien actif selon la page / la section visible.
 */
export function initNav() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  initScrollState(nav);
  initMegaMenu(nav);
  initMobilePanel(nav);
  initActiveLinks(nav);
}

function initScrollState(nav) {
  let lastY = window.scrollY;

  function update() {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 20);
    const goingDown = y > lastY && y > 160;
    const busy = nav.classList.contains('is-open') || nav.querySelector('.site-nav__item--mega.is-open');
    nav.classList.toggle('is-hidden', goingDown && !busy);
    lastY = y;
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initMegaMenu(nav) {
  const item = nav.querySelector('.site-nav__item--mega');
  const toggle = item && item.querySelector('.site-nav__toggle');
  if (!item || !toggle) return;

  const canHover = window.matchMedia('(hover: hover)');
  let closeTimer;

  function setOpen(open) {
    item.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    setOpen(!item.classList.contains('is-open'));
  });

  item.addEventListener('mouseenter', function () {
    if (!canHover.matches) return;
    clearTimeout(closeTimer);
    setOpen(true);
  });

  item.addEventListener('mouseleave', function () {
    if (!canHover.matches) return;
    closeTimer = setTimeout(function () { setOpen(false); }, 120);
  });

  document.addEventListener('click', function (e) {
    if (!item.contains(e.target)) setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && item.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
}

function initMobilePanel(nav) {
  const burger = nav.querySelector('.site-nav__burger');
  const panel = nav.querySelector('.site-nav__panel');
  const backdrop = nav.querySelector('.site-nav__backdrop');
  if (!burger || !panel) return;

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    document.documentElement.classList.toggle('nav-locked', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  }

  burger.addEventListener('click', function () {
    setOpen(!nav.classList.contains('is-open'));
  });

  if (backdrop) backdrop.addEventListener('click', function () { setOpen(false); });

  panel.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { setOpen(false); });
  });

  panel.querySelectorAll('.site-nav__panel-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      burger.focus();
    }
  });

  // Repasse en affichage bureau : on referme le panneau
  window.matchMedia('(min-width: 1081px)').addEventListener('change', function (mq) {
    if (mq.matches) setOpen(false);
  });
}

function initActiveLinks(nav) {
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  const isHome = page === 'index.html';

  let pageKey = null;
  if (path.indexOf('/pages/services/') !== -1) pageKey = 'services';
  else if (page === 'secteurs.html') pageKey = 'secteurs';
  else if (page === 'a-propos.html') pageKey = 'a-propos';

  function setActive(key) {
    nav.querySelectorAll('[data-nav]').forEach(function (el) {
      el.classList.toggle('is-active', el.dataset.nav === key);
    });
  }

  if (!isHome) {
    setActive(pageKey);
    return;
  }

  // Accueil : la section visible détermine le lien actif
  const sections = ['pourquoi-nous', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  function onScroll() {
    const y = window.scrollY + window.innerHeight * 0.35;
    let key = 'accueil';
    sections.forEach(function (s) {
      if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) key = s.id;
    });
    setActive(key);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
