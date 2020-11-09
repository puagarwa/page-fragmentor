import { createPages } from './create_pages';

function getConfig() {
  if (window.pagedConfig) {
    return window.pagedConfig;
  }

  const config = document.querySelector('meta[name=paged-config]');
  if (config?.content.trim()) {
    return JSON.parse(config.content.trim());
  }

  return {};
}

window.addEventListener('load', () => {
  createPages(getConfig());
});
