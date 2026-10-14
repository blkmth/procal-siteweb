/**
 * PROCESS CALIBRATION — point d'entrée JavaScript
 */
import { injectLayout } from './modules/layout.js';
import { initNav } from './modules/nav.js';
import { initCarousels } from './modules/carousel.js';
import initSecteursCarousel from './modules/secteursCarousel.js';

document.addEventListener('DOMContentLoaded', async function () {
  await injectLayout();

  initNav();
  initScrollAnimations();
  initCounters();
  initSmoothScroll();
  initParallax();
  initCarousels();
  initSecteursCarousel();
});

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

function initSmoothScroll() {
  const navbar = document.getElementById('navbar');
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const bar = navbar && navbar.querySelector('.site-nav__bar');
      const h = bar ? bar.getBoundingClientRect().bottom : 100;
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

