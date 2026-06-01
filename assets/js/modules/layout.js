/**
 * Injection des partials nav / footer
 */
export async function injectLayout() {
  const base = document.body.dataset.base || './';
  const home = document.body.dataset.home || 'index.html';

  const navSlot = document.getElementById('site-nav');
  const footerSlot = document.getElementById('site-footer');

  const tasks = [];

  if (navSlot) {
    tasks.push(
      fetch(base + 'partials/nav.html')
        .then(function (r) {
          if (!r.ok) throw new Error('nav');
          return r.text();
        })
        .then(function (html) {
          navSlot.innerHTML = applyTokens(html, base, home);
        })
    );
  }

  if (footerSlot) {
    tasks.push(
      fetch(base + 'partials/footer.html')
        .then(function (r) {
          if (!r.ok) throw new Error('footer');
          return r.text();
        })
        .then(function (html) {
          footerSlot.innerHTML = applyTokens(html, base, home);
        })
    );
  }

  await Promise.all(tasks);
}

function applyTokens(html, base, home) {
  return html.replace(/\{\{ROOT\}\}/g, base).replace(/\{\{HOME\}\}/g, home);
}
