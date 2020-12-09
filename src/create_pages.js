import { extractOverflow } from './extract_overflow';
import { parseAnPlusB } from './parse_an_plus_b';
import { parsePageSize } from './parse_page_size';

function findForPage(nodes, pageNumber) {
  return nodes.find(({ match }) => match(pageNumber))?.fragment;
}

function newPage({ footers, headers, pageNumber }) {
  const page = document.createElement('div');
  page.classList.add('page');
  page.setAttribute('role', 'region');
  page.setAttribute('aria-label', `Page ${pageNumber}`);
  page.setAttribute('data-page-number', pageNumber);
  page.style.setProperty('--page-number', pageNumber);
  document.body.appendChild(page);
  const pageInner = document.createElement('div');
  pageInner.classList.add('page-inner');
  page.appendChild(pageInner);

  const header = findForPage(headers, pageNumber);
  if (header) {
    const pageHeader = document.createElement('div');
    pageHeader.classList.add('page-header');
    pageInner.appendChild(pageHeader);
    pageHeader.appendChild(header.cloneNode(true));
  }

  const pageContent = document.createElement('div');
  pageContent.classList.add('page-content');
  pageInner.appendChild(pageContent);

  const footer = findForPage(footers, pageNumber);
  if (footer) {
    const pageFooter = document.createElement('div');
    pageFooter.classList.add('page-footer');
    pageInner.appendChild(pageFooter);
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

function extractSelector(selector) {
  return Array
    .from(document.querySelectorAll(selector))
    .map((node) => {
      const fragment = document.createDocumentFragment();
      Array.from(node.childNodes).forEach((child) => {
        fragment.appendChild(child);
      });
      node.remove();
      return { fragment, match: parseAnPlusB(node.dataset.pagerPageSelector) };
    });
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
export function createPages() {
  const size = parsePageSize(window.getComputedStyle(document.body).getPropertyValue('--page-size'));
  document.documentElement.style.setProperty('--page-width', size[0]);
  document.documentElement.style.setProperty('--page-height', size[1]);

  const headers = extractSelector('body > header');
  const footers = extractSelector('body > footer');
  let content = getStartingContent();
  let pageCount = 0;

  while (content && !empty(content)) {
    pageCount += 1;
    const page = newPage({ footers, headers, pageNumber: pageCount });
    page.appendChild(content);
    content = extractOverflow(page);
  }

  document.body.style.setProperty('--page-count', pageCount);
  document.body.hidden = true;
  // Forces safari to update the counters
  setTimeout(() => {
    document.body.hidden = false;
  }, 0);
}
