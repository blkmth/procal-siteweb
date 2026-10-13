/**
 * PROCESS CALIBRATION — point d'entrée JavaScript
 */
import { injectLayout } from './modules/layout.js';
import { initCarousels } from './modules/carousel.js';
import initSecteursCarousel from './modules/secteursCarousel.js';

document.addEventListener('DOMContentLoaded', async function () {
  await injectLayout();

  initNavbar();
  initMobileMenu();
  initNavDropdown();
  initScrollAnimations();
  initCounters();
  initNavActiveLinks();
  initSmoothScroll();
  initParallax();
  initCarousels();
  initSecteursCarousel();
});

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScrollY = window.scrollY;

  function handleNavbarScroll() {
    const currentScrollY = window.scrollY;
    navbar.classList.toggle('scrolled', currentScrollY > 50);

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      navbar.style.top = '-150px';
    } else {
      navbar.style.top = '0px';
    }
    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();
}

function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', function () {
    const open = navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      const dd = document.getElementById('nav-services-dropdown');
      if (dd) dd.classList.remove('open');
    });
  });

  document.addEventListener('click', function (e) {
    const dd = document.getElementById('nav-services-dropdown');
    if (dd && !dd.contains(e.target) && !hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      dd.classList.remove('open');
    }
  });
}

function initNavDropdown() {
  const dropdown = document.getElementById('nav-services-dropdown');
  const toggle = document.getElementById('nav-services-toggle');
  if (!dropdown || !toggle) return;

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = dropdown.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      dropdown.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-fadeup');
  if (!animatedElements.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  animatedElements.forEach(function (el) {
    observer.observe(el);
  });

  const cards = document.querySelectorAll('.service-card, .argument-card, .stat-card');
  const cardObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const siblings = Array.from(entry.target.parentElement.children);
          entry.target.style.transitionDelay = siblings.indexOf(entry.target) * 0.08 + 's';
          entry.target.classList.add('visible');
          cardObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  cards.forEach(function (card) {
    card.classList.add('animate-fadeup');
    cardObserver.observe(card);
  });
}

function initCounters() {
  const counters = document.querySelectorAll('.counter');
  const statsSection = document.getElementById('chiffres');
  if (!counters.length || !statsSection) return;

  const statsObserver = new IntersectionObserver(
    function (entries) {
      if (entries[0].isIntersecting) {
        counters.forEach(animateCounter);
        statsObserver.unobserve(statsSection);
      }
    },
    { threshold: 0.3 }
  );

  statsObserver.observe(statsSection);
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const start = performance.now();

  function step(currentTime) {
    const progress = Math.min((currentTime - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }

  requestAnimationFrame(step);
}

function initNavActiveLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  function setActiveLink() {
    const navbar = document.getElementById('navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 100;
    const scrollPos = window.scrollY + navbarHeight + 20;
    let currentSection = '';

    sections.forEach(function (section) {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentSection);
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();
}



function initSmoothScroll() {
  const navbar = document.getElementById('navbar');
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const h = navbar ? navbar.offsetHeight : 100;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - h - 8,
        behavior: 'smooth'
      });
    });
  });
}

function initParallax() {
  const heroContent = document.querySelector('.hero-section:not(.hero-section--service) .hero-content');
  if (!heroContent || window.innerWidth <= 768) return;

  let ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        heroContent.style.transform = 'translateY(' + window.scrollY * 0.35 + 'px)';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

