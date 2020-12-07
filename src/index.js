import { createPages } from './create_pages';

// Wait for everything to load
window.addEventListener('load', async () => {
  // Fonts aren't included in load 🤷
  await document.fonts.ready;
  // Fragment the pages
  createPages();
});
