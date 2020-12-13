/**
 * Yields each line box as a range
 *
 * The selection API is the only API that gives any access to lineboxes
 *
 * Calculating though measuring ranges is slow and cannot cope
 * with different writing directions or unusual margins are paddings.
 */
export function* lineBoxGenerator(texts) {
  const textRange = new Range();
  textRange.setStartBefore(texts[0]);
  textRange.setEndAfter(texts[texts.length - 1]);

  const selection = window.getSelection();

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

    if (textRange.compareBoundaryPoints(Range.END_TO_END, lineRange) === -1) {
      lineRange.setEnd(textRange.endContainer, textRange.endOffset);
    }

    yield lineRange;

    if (textRange.compareBoundaryPoints(Range.END_TO_END, lineRange) === 0) {
      break;
    }

    if (lastRange && lineRange.compareBoundaryPoints(Range.START_TO_START, lastRange) === 0) {
      console.log(lineRange.toString());
      console.log(lastRange.toString());
    }

    lastRange = lineRange.cloneRange();
  }
}
