import { overflowRange } from './overflow_range';
import { parsePageSize } from './parse_page_size';
import { extractWithClonedTHead } from './extract_with_cloned_thead';

function newPage({ footer, header, pageNumber }) {
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

  if (header) {
    const pageHeader = document.createElement('div');
    pageHeader.classList.add('page-header');
    pageInner.appendChild(pageHeader);
    pageHeader.appendChild(header.cloneNode(true));
  }

  const pageContent = document.createElement('div');
  pageContent.classList.add('page-content');
  pageInner.appendChild(pageContent);

  if (footer) {
    const pageFooter = document.createElement('div');
    pageFooter.classList.add('page-footer');
    pageInner.appendChild(pageFooter);
    pageFooter.appendChild(footer.cloneNode(true));
  }
  return pageContent;
}

function childrenToFragment(node) {
  const fragment = document.createDocumentFragment();
  Array.from(node.childNodes).forEach((child) => {
    fragment.appendChild(child);
  });
  return fragment;
}

function getStartingContent() {
  const main = document.querySelector('body > main');
  const content = childrenToFragment(main || document.body);
  main?.remove();
  return content;
}

function extractSelector(selector) {
  const node = document.querySelector(selector);
  if (node) {
    return childrenToFragment(node);
  }
  return null;
}

function emptyFragment(node) {
  return !node.hasChildNodes()
    || (node.childNodes.length === 1
      && node.firstChild.nodeType === Node.TEXT_NODE
      && !node.firstChild.data.trim()
    );
}

function emptyRange(range) {
  if (!range || range.collapsed) {
    return true;
  }
  return false;
}

/**
 * Move the content into pages
 */
export function createPages() {
  const size = parsePageSize(window.getComputedStyle(document.body).getPropertyValue('--page-size'));
  document.documentElement.style.setProperty('--page-width', size[0]);
  document.documentElement.style.setProperty('--page-height', size[1]);

  const header = extractSelector('body > header');
  const footer = extractSelector('body > footer');
  let content = getStartingContent();
  document.body.innerHTML = '';
  let pageCount = 0;
  let forceExtraPage = false;

  while (content && (!emptyFragment(content) || forceExtraPage)) {
    pageCount += 1;

    const page = newPage({ footer, header, pageNumber: pageCount });
    if (content) {
      page.appendChild(content);
    }

    const range = overflowRange(page);

    if (emptyRange(range)) {
      // Last page
      page.closest('.page').dataset.lastPage = 'true';

      if (!emptyRange(overflowRange(page))) {
        // Need to force an extra page
        delete page.closest('.page').dataset.lastPage;
        forceExtraPage = true;
      }
    }

    if (forceExtraPage) {
      break;
    }

    content = range ? extractWithClonedTHead(range) : null;
  }

  document.body.style.setProperty('--page-count', pageCount);
}
