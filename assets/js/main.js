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
  initFormDevis();
  initFormContact();
  initSmoothScroll();
  initParallax();
  initFileInput();
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



function initFormDevis() {
  const form = document.getElementById('form-devis');
  const btnSubmit = document.getElementById('btn-submit-devis');
  const successMsg = document.getElementById('success-devis');
  if (!form || !btnSubmit) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nom = form.querySelector('[name="nom"]');
    const entreprise = form.querySelector('[name="entreprise"]');
    const telephone = form.querySelector('[name="telephone"]');
    const email = form.querySelector('[name="email"]');
    const prestation = form.querySelector('[name="prestation"]');
    const descriptionEl = form.querySelector('[name="description"]');

    [nom, entreprise, telephone, email, prestation].forEach(function (f) {
      if (f) f.style.borderColor = '';
    });

    let isValid = true;
    if (!nom?.value.trim()) { if (nom) nom.style.borderColor = '#e74c3c'; isValid = false; }
    if (!entreprise?.value.trim()) { if (entreprise) entreprise.style.borderColor = '#e74c3c'; isValid = false; }
    if (!telephone?.value.trim()) { if (telephone) telephone.style.borderColor = '#e74c3c'; isValid = false; }
    if (!email?.value.trim() || !email.value.includes('@')) { if (email) email.style.borderColor = '#e74c3c'; isValid = false; }
    if (!prestation?.value) { if (prestation) prestation.style.borderColor = '#e74c3c'; isValid = false; }
    if (!isValid) return;

    const originalText = btnSubmit.innerHTML;
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';

    const formData = new FormData();
    formData.append("access_key", "9a5fc893-1160-469d-91a3-420da864d9f5");
    formData.append("subject", "Nouvelle demande de devis PROCAL");
    formData.append("Nom", nom.value.trim());
    formData.append("Entreprise", entreprise.value.trim());
    formData.append("Téléphone", telephone.value.trim());
    formData.append("Email", email.value.trim());
    formData.append("Prestation", prestation.options[prestation.selectedIndex].text);
    formData.append("Description", (descriptionEl && descriptionEl.value.trim()) || 'Non renseigné');

    const fichierInput = document.getElementById('fichier');
    const hasFile = fichierInput && fichierInput.files.length > 0;

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    })
    .then(async (response) => {
      if (response.status === 200) {
        form.style.display = 'none';
        if (successMsg) {
          successMsg.style.display = 'block';
          if (hasFile) {
            successMsg.innerHTML = '<i class="fas fa-circle-check"></i>' +
              '<h3>Demande envoyée avec succès</h3>' +
              '<p>Nous vous contacterons dans les <strong>24 heures</strong>.</p>' +
              '<p style="margin-top:10px;font-size:0.9rem;color:var(--text-muted);">' +
              '<i class="fas fa-paperclip"></i> Votre pièce jointe n\'a pas pu être transmise automatiquement. ' +
              'Merci de l\'envoyer par email à <a href="mailto:Procal@procal-ci.com" style="color:var(--brand);font-weight:600;">Procal@procal-ci.com</a></p>';
          }
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        throw new Error("Erreur serveur");
      }
    })
      .catch((error) => {
        alert("Erreur lors de l'envoi. Contactez-nous par téléphone.");
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = originalText;
      });
  });
}

function initFormContact() {
  const form = document.getElementById('form-contact');
  const btnSubmit = document.getElementById('btn-submit-contact');
  const successMsg = document.getElementById('success-contact');
  if (!form || !btnSubmit) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const nom = document.getElementById('contact-nom');
    const email = document.getElementById('contact-email');
    const message = document.getElementById('contact-message');

    [nom, email, message].forEach(function (f) { if (f) f.style.borderColor = ''; });
    let isValid = true;
    if (!nom.value.trim()) { nom.style.borderColor = '#e74c3c'; isValid = false; }
    if (!email.value.trim() || !email.value.includes('@')) { email.style.borderColor = '#e74c3c'; isValid = false; }
    if (!message.value.trim()) { message.style.borderColor = '#e74c3c'; isValid = false; }
    if (!isValid) return;

    const originalText = btnSubmit.innerHTML;
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';

    const formData = new FormData();
    formData.append("access_key", "9a5fc893-1160-469d-91a3-420da864d9f5");
    formData.append("subject", "Nouveau message de contact PROCAL");
    formData.append("Nom", nom.value.trim());
    formData.append("Email", email.value.trim());
    formData.append("Téléphone", document.getElementById('contact-tel')?.value.trim() || 'Non renseigné');
    formData.append("Message", message.value.trim());

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    })
      .then(async (response) => {
        if (response.status === 200) {
          form.style.display = 'none';
          if (successMsg) successMsg.style.display = 'block';
        } else {
          throw new Error("Erreur serveur");
        }
      })
      .catch((error) => {
        alert("Erreur lors de l'envoi.");
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = originalText;
      });
  });
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

function initFileInput() {
  const fileInput = document.getElementById('fichier');
  const fileLabel = document.querySelector('label.file-upload-label[for="fichier"]');
  if (!fileInput || !fileLabel) return;

  fileInput.addEventListener('change', function () {
    if (fileInput.files.length > 0) {
      const name = fileInput.files[0].name;
      fileLabel.innerHTML = '<i class="fas fa-check-circle"></i> ' + (name.length > 40 ? name.slice(0, 37) + '...' : name);
    } else {
      fileLabel.innerHTML = '<i class="fas fa-paperclip"></i> Joindre un fichier (PDF, Word, image)';
    }
  });
}
