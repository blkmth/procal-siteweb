/**
 * Carrousel pour la section "Secteurs" — slides rectangulaires larges
 */
export function initSecteursCarousel() {
  document.querySelectorAll('[data-sectors-carousel]').forEach(initSection);
}

function initSection(section) {
  const slides = section.querySelectorAll('.sector-slide');
  const dots = section.querySelectorAll('.sector-dot');
  const announcer = section.querySelector('.sector-announcer');
  if (!slides.length) return;

  let current = 0;
  let intervalId = null;
  const INTERVAL = 5000;

  function loadBgFor(slide) {
    const media = slide.querySelector('.sector-media');
    if (!media) return;
    const src = media.dataset.bg;
    if (!src) return;
    if (media.dataset.loaded) return;
    const img = new Image();
    img.src = src;
    img.onload = () => {
      media.style.backgroundImage = `url('${src}')`;
      media.dataset.loaded = '1';
    };
  }

  function goTo(i) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
    // lazy load current and next media
    loadBgFor(slides[current]);
    loadBgFor(slides[(current + 1) % slides.length]);
    // announce for screen readers
    if (announcer) {
      const title = slides[current].querySelector('.sector-title')?.textContent?.trim() || '';
      const subtitle = slides[current].querySelector('.sector-subtitle')?.textContent?.trim() || '';
      announcer.textContent = title + (subtitle ? ' — ' + subtitle : '');
    }
  }

  function next() {
    goTo(current + 1);
  }

  function start() {
    stop();
    intervalId = setInterval(next, INTERVAL);
  }

  function stop() {
    if (intervalId) { clearInterval(intervalId); intervalId = null; }
  }

  dots.forEach(d => d.addEventListener('click', () => { goTo(parseInt(d.dataset.slide,10)); start(); }));

  // Prev / Next
  const btnPrev = section.querySelector('.sector-prev');
  const btnNext = section.querySelector('.sector-next');
  if (btnPrev) btnPrev.addEventListener('click', () => { goTo(current - 1); start(); });
  if (btnNext) btnNext.addEventListener('click', () => { goTo(current + 1); start(); });

  section.addEventListener('mouseenter', stop);
  section.addEventListener('mouseleave', start);
  section.addEventListener('touchstart', stop, { passive: true });
  section.setAttribute('tabindex', '0');
  section.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); start(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); start(); }
  });

  // start: set active slide and preload images
  slides.forEach((s, idx) => { if (idx !== 0) s.classList.remove('active'); else s.classList.add('active'); });
  dots[0]?.classList.add('active');
  loadBgFor(slides[0]);
  loadBgFor(slides[1 % slides.length]);
  start();
}

export default initSecteursCarousel;
