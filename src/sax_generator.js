function* iterateLevel(walker, inline = false) {
  do {
    const { currentNode } = walker;

    if (currentNode.nodeType === Node.TEXT_NODE) {
      yield ['text', currentNode];
      continue;
    }

    // Inline can only be broken across text nodes
    const isInline = inline || window.getComputedStyle(currentNode).display.includes('inline');

    if (!isInline) {
      yield ['enter', currentNode];
    }

    if (!currentNode.matches('picture,video,canvas,object,audio,embed,iframe') && walker.firstChild()) {
      yield* iterateLevel(walker, isInline);
      walker.parentNode();
    }

    if (!isInline) {
      yield ['exit', currentNode];
    }
  } while (walker.nextSibling());
}

const types = NodeFilter.SHOW_ELEMENT + NodeFilter.SHOW_TEXT;

/**
 * SAX parser style DOM iterator
 *
 * Yields ['enter', node], ['text', node] and ['exit', node] values for a DOM structure
 *
 * See TreeWalker documentation on MDN
 *
 * @param [Element] The root element
 * @param [Integer] Types filter
 * @param [NodeFilter] Filter including nodes
 */
export function* saxGenerator(root, nodeFilter) {
  const walker = document.createTreeWalker(root, types, nodeFilter);
  if (!walker.nextNode()) {
    return;
  }
  yield* iterateLevel(walker);
}
