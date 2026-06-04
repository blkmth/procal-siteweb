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
  const INTERVAL_MS = 3000;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Ensure background images are lazy-loaded when a slide becomes active.
  function extractBg(slide) {
    // support inline style background-image or data-bg attribute
    const inline = slide.style && slide.style.backgroundImage;
    const data = slide.getAttribute('data-bg');
    if (data) return data;
    if (inline) {
      const m = inline.match(/url\(["']?(.*?)["']?\)/);
      if (m && m[1]) return m[1];
    }
    return null;
  }

  function loadBg(index) {
    const idx = (index + slides.length) % slides.length;
    const slide = slides[idx];
    if (!slide) return;
    if (slide.dataset.bgLoaded === 'true') return;
    const url = extractBg(slide);
    if (!url) return;
    // apply background-image (lazy)
    slide.style.backgroundImage = `url("${url}")`;
    slide.dataset.bgLoaded = 'true';
  }

  function goToSlide(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');

    current = (index + slides.length) % slides.length;

    // load current and next slide backgrounds for smooth transition
    loadBg(current);
    loadBg(current + 1);

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

  // Load the first slides immediately (current + next) to avoid white flash
  loadBg(current);
  loadBg(current + 1);

  startAutoplay();
}
