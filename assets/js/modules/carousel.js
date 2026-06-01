/**
 * Carrousel hero — même comportement sur accueil et pages services
 */
export function initCarousels() {
  document.querySelectorAll('[data-carousel]').forEach(initCarouselSection);
}

function initCarouselSection(section) {
  const slides = section.querySelectorAll('.hero-slide');
  const dots = section.querySelectorAll('.carousel-dot');

  if (!slides.length) return;

  let current = 0;
  let intervalId = null;
  const INTERVAL_MS = 5500;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function goToSlide(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function nextSlide() {
    goToSlide(current + 1);
  }

  function startAutoplay() {
    if (prefersReducedMotion || slides.length < 2) return;
    stopAutoplay();
    intervalId = window.setInterval(nextSlide, INTERVAL_MS);
  }

  function stopAutoplay() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      const target = parseInt(dot.getAttribute('data-slide'), 10);
      if (!Number.isNaN(target)) {
        goToSlide(target);
        startAutoplay();
      }
    });
  });

  const carousel = section.querySelector('.hero-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
  }

  section.addEventListener('mouseenter', stopAutoplay);
  section.addEventListener('mouseleave', startAutoplay);

  startAutoplay();
}
