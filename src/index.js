import { createPages } from './create_pages';

window.addEventListener('DOMContentLoaded', async () => {
  document.body.setAttribute('aria-busy', 'true');
});

// Wait for everything to load
window.addEventListener('load', async () => {
  // Fonts aren't included in load 🤷
  await document.fonts.ready;
  // Fragment the pages
  createPages();

  document.body.setAttribute('aria-busy', 'false');

  // Firefox won't scroll to top in the same tick
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 0);
});
