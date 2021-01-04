/**
 * Yields each line box as a range
 *
 * The selection API is the only API that gives any access to lineboxes
 *
 * Calculating though measuring ranges is slow and cannot cope
 * with different writing directions or unusual margins are paddings.
 */
export function* lineBoxGenerator(nodes) {
  const selection = window.getSelection();

  const firstText = nodes.find((node) => node.nodeType === Node.TEXT_NODE);
  const lastText = [...nodes].reverse().find((node) => node.nodeType === Node.TEXT_NODE);

  if (!firstText) {
    return;
  }

  const textRange = new Range();
  textRange.setStart(firstText, 0);
  textRange.setEnd(lastText, lastText.data.length);

  selection.empty();
  selection.addRange(textRange);
  selection.collapseToStart();

  let lastRange = null;

  while (true) {
    selection.modify('extend', 'forward', 'line');

    const lineRange = selection.getRangeAt(0);

    if (lastRange) {
      lineRange.setStart(lastRange.endContainer, lastRange.endOffset);
    }

    if (lineRange.collapsed) {
      return;
    }

    // Chrome gets stuck at full width inline blocks
    // So jump end to the start of the next text node
    if (lineRange.endOffset === 0 && lineRange.endContainer.nodeType === Node.ELEMENT_NODE) {
      const node = nodes.find((item) => (
        item.nodeType === Node.TEXT_NODE
          && item !== lineRange.endContainer
          && lineRange.comparePoint(item, 0) === 1
      ));
      if (node) {
        lineRange.setEndBefore(node);
      }
    }

    if (textRange.compareBoundaryPoints(Range.END_TO_END, lineRange) === -1) {
      lineRange.setEnd(textRange.endContainer, textRange.endOffset);
    }

    // Stuck protection
    if (lastRange && lineRange.compareBoundaryPoints(Range.START_TO_START, lastRange) === 0) {
      break;
    }

    yield lineRange;

    // At end of the text range
    if (textRange.compareBoundaryPoints(Range.END_TO_END, lineRange) === 0) {
      break;
    }

    lastRange = lineRange.cloneRange();
  }
}
