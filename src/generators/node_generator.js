function* iterateLevel(walker, inline = false) {
  do {
    const { currentNode } = walker;

    if (currentNode.nodeType === Node.TEXT_NODE) {
      yield ['inline', currentNode];
      continue;
    }

    // Inline can only be broken across text nodes
    const isInline = inline || window.getComputedStyle(currentNode).display.includes('inline');

    yield [isInline ? 'inline' : 'enter', currentNode];

    if (!currentNode.matches('picture,video,canvas,object,audio,embed,iframe,svg,math') && walker.firstChild()) {
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
 */
export function* nodeGenerator(root, nodeFilter) {
  const walker = document.createTreeWalker(root, types, nodeFilter);
  if (!walker.nextNode()) {
    return;
  }
  yield* iterateLevel(walker);
}
