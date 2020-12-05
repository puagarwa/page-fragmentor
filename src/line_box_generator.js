function hasMultipleLines(range) {
  let maxBottom;
  return Array.from(range.getClientRects())
    .filter((r) => r.width)
    .some((r) => {
      const { top, bottom } = r;
      if (maxBottom !== undefined && top >= maxBottom) {
        return true;
      }
      if (maxBottom === undefined || bottom > maxBottom) {
        maxBottom = bottom;
      }
      return false;
    });
}

/**
 * Yields each line box as a range
 *
 * Determine where a line box begins and end perfectly is near impossible.  There are
 * edge cases that cannot be accounted for.
 *
 * You could use logical progression, as in each DOMRect must follow the next to
 * the left, however with rtl characters they may follow to the right and this cannot
 * be determined without implementing complex Unicode algorithms.  Additionally
 * negative left or might margins means there maybe some overlap.
 *
 * Alternatively you can look for a DOMRect that is below the previous.  However,
 * small line-height values, <sub>, <sup>, vertical-align values, margin or block elements
 * may cause elements to appear to be below the line.
 *
 * This algorithm assumes a new line box when a DOMRect is encountered that
 * clears the maximum bottom of the previous rects
 */
export function* lineBoxGenerator(texts) {
  let textCursor = 0;
  let currentText = texts[textCursor];
  let lineBox = new Range();
  lineBox.setStart(currentText, 0);
  let cursor = 1;

  while (currentText) {
    const newBox = lineBox.cloneRange();
    newBox.setEnd(currentText, cursor);
    if (hasMultipleLines(newBox)) {
      yield lineBox;
      newBox.setStart(lineBox.endContainer, lineBox.endOffset);
      cursor = lineBox.endOffset;
    }
    lineBox = newBox;

    cursor += 1;
    if (cursor === currentText.data.length) {
      cursor = 0;
      textCursor += 1;
      currentText = texts[textCursor];
    }
  }
}
