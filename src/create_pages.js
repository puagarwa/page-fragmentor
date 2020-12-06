import { extractOverflow } from './extract_overflow';

function newPage({ footer, header, pageNumber }) {
  const page = document.createElement('div');
  page.classList.add('page');
  page.setAttribute('role', 'region');
  page.setAttribute('aria-label', `Page ${pageNumber}`);
  page.setAttribute('data-paged-page-number', pageNumber);
  page.style.setProperty('--paged-page-number', pageNumber);
  document.body.appendChild(page);

  if (header) {
    const pageHeader = document.createElement('div');
    pageHeader.classList.add('page-header');
    page.appendChild(pageHeader);
    pageHeader.appendChild(header.cloneNode(true));
  }

  const pageContent = document.createElement('div');
  pageContent.classList.add('page-content');
  page.appendChild(pageContent);

  if (footer) {
    const pageFooter = document.createElement('div');
    pageFooter.classList.add('page-footer');
    page.appendChild(pageFooter);
    pageFooter.appendChild(footer.cloneNode(true));
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

function empty(node) {
  return !node.hasChildNodes()
    || (node.childNodes.length === 1
      && node.firstChild.nodeType === Node.TEXT_NODE
      && !node.firstChild.data.trim()
    );
}

/**
 * Move the content into pages
 */
export function createPages({ rules = [] } = {}) {
  const header = getHeader();
  const footer = getFooter();
  let content = getStartingContent();
  let pageCount = 0;

  while (content && !empty(content)) {
    pageCount += 1;
    const page = newPage({ footer, header, pageNumber: pageCount });
    page.appendChild(content);
    content = extractOverflow(page, { rules });
  }

  document.body.style.setProperty('--paged-page-count', pageCount);
}
