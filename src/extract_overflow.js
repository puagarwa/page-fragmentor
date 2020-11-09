function* visibleNodes(node) {
  for (const child of Array.from(node.childNodes)) {
    if (![Node.ELEMENT_NODE, Node.TEXT_NODE].includes(child.nodeType)) {
      node.removeChild(child);
      continue;
    }

    let rect;

    if (child.nodeType === Node.TEXT_NODE) {
      const range = document.createRange();
      range.selectNode(child);
      rect = range.getBoundingClientRect();
    } else {
      rect = child.getBoundingClientRect();
    }

    if (rect.height === 0) {
      node.removeChild(child);
      continue;
    }

    yield child;
  }
}

function rangeOverflow(node, parentRect, { rules }) {
  const range = document.createRange();
  let overflowing = false;

  for (const child of visibleNodes(node)) {
    let rule;
    if (child.nodeType === Node.ELEMENT_NODE) {
      rule = rules.find(({ selector }) => child.matches(selector));
    }

    if (rule?.break === 'after' && rule?.value === 'page') {
      overflowing = true;
      continue;
    }

    const nodeRect = child.getBoundingClientRect();

    if (overflowing) {
      range.setStartBefore(child);
      return range;
    }

    if (rule?.break === 'before' && rule?.value === 'page') {
      range.setStartBefore(child);
      return range;
    }

    if (nodeRect.bottom > parentRect.bottom) {
      range.setStartBefore(child);
      return range;
    }
  }

  return null;
}

/**
 * Remove any overflow from a page and return it as a document fragment
 *
 * rules is an array of rule objects
 *
 * { selectors: ['p'], break: 'before', value: 'page' }
 *
 * - selectors: For each element the first rule matching a selector is used
 * - rules: 'break-before' or 'break-after'
 * - value: auto (default), avoid, page
 *
 * TODO: pass a range to the overflow function
 * TODO: avoid
 * TODO: other types of nodes?
 * TODO: prevent infinite loops
 * TODO: Fragment boxes?
 * TODO: Orphans and widows?
 */
export function extractOverflow(node, { rules }) {
  const pageRect = node.getBoundingClientRect();
  const range = rangeOverflow(node, pageRect, { rules });
  let overflow = null;

  if (range) {
    range.setEndAfter(node.lastChild);
    overflow = range.extractContents();
  }

  if (!node.hasChildNodes()) {
    node.appendChild(overflow);
    return null;
  }

  return overflow;
}
