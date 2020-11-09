import { extractOverflow } from './extract_overflow';

function replacePlaceholders(node, name, value) {
  node.querySelectorAll(`[data-placeholder="${CSS.escape(name)}"]`).forEach((placeholder) => {
    placeholder.textContent = value; // eslint-disable-line no-param-reassign
  });
}

function newPage({ footer, header, meta }) {
  meta.pages += 1; // eslint-disable-line no-param-reassign

  const page = document.createElement('div');
  page.classList.add('page');
  page.setAttribute('role', 'region');
  page.setAttribute('aria-label', `Page ${meta.pages}`);
  document.body.appendChild(page);

  if (header) {
    const pageHeader = document.createElement('div');
    pageHeader.classList.add('page-header');
    page.appendChild(pageHeader);
    pageHeader.appendChild(header.cloneNode(true));
    replacePlaceholders(pageHeader, 'pageNumber', meta.pages);
  }

  const pageContent = document.createElement('div');
  pageContent.classList.add('page-content');
  page.appendChild(pageContent);

  if (footer) {
    const pageFooter = document.createElement('div');
    pageFooter.classList.add('page-footer');
    page.appendChild(pageFooter);
    pageFooter.appendChild(footer.cloneNode(true));
    replacePlaceholders(pageFooter, 'pageNumber', meta.pages);
  }
  return pageContent;
}

function getStartingContent() {
  const content = document.createDocumentFragment();

  const source = document.querySelector('main') || document.body;

  Array.from(source.childNodes).forEach((child) => {
    content.appendChild(child);
  });

  return content;
}

function getHeader() {
  const header = document.querySelector('body > header');
  if (!header) {
    return null;
  }
  const content = document.createDocumentFragment();
  Array.from(header.childNodes).forEach((child) => {
    content.appendChild(child);
  });
  header.remove();
  return content;
}

function getFooter() {
  const footer = document.querySelector('body > footer');
  if (!footer) {
    return null;
  }
  const content = document.createDocumentFragment();
  Array.from(footer.childNodes).forEach((child) => {
    content.appendChild(child);
  });
  footer.remove();
  return content;
}

/**
 * Move the content into pages
 */
export function createPages({ rules = [] } = {}) {
  const meta = { pages: 1 };
  const header = getHeader();
  const footer = getFooter();
  let content = getStartingContent();

  while (content?.hasChildNodes()) {
    const page = newPage({ footer, header, meta });
    page.appendChild(content);
    content = extractOverflow(page, { rules });
  }
  replacePlaceholders(document.body, 'pageCount', meta.pages);
}
