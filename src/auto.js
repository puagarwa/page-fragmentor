import { createPages } from './index';

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

  // Line boxes are found using the selection api
  // Clear any selection and return to top
  window.getSelection().empty();
  window.scrollTo(0, 0);
});
