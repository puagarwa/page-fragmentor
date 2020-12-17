import { BaseBreakPoint } from './base_break_point';
import { lineBoxGenerator } from '../line_box_generator';

function calculateBottomSpace(range) {
  let container = range.commonAncestorContainer;
  if (container.nodeType === Node.TEXT_NODE) {
    container = container.parentElement;
  }

  const style = window.getComputedStyle(container);
  const size = (parseFloat(style.paddingBottom) || 0)
    + (parseFloat(style.borderBottomWidth) || 0)
    + (parseFloat(style.marginBottom) || 0);

  return Math.ceil(Math.max(size, 0));
}

export class TextBreakPoint extends BaseBreakPoint {
  constructor() {
    super();
    this.texts = [];
  }

  addText(node, { inheritedAvoid, orphans, widows }) {
    this.texts.push(node);
    this.inheritedAvoid ??= inheritedAvoid;
    this.orphans ??= orphans;
    this.widows ??= widows;
  }

  range(root, disableRules = []) {
    if (!disableRules.includes(4) && this.inheritedAvoid) {
      return null;
    }
    let { widows, orphans } = this;

    // Values less than one must be ignored.
    // as we are using CSS variables, revert to the default
    if (widows < 1) {
      widows = 2;
    }
    if (orphans < 1) {
      orphans = 2;
    }
    if (disableRules.includes(3)) {
      widows = 1;
      orphans = 1;
    }

    const textRange = new Range();
    textRange.setStart(this.firstText, 0);
    textRange.setEnd(this.lastText, this.lastText.data.length);

    const rootRect = root.getBoundingClientRect();
    let lineBoxes = [];
    let overflow = false;
    let overflowIndex;

    const bottomSpace = calculateBottomSpace(textRange);

    for (const lineBox of lineBoxGenerator(textRange)) {
      if (!overflow) {
        const rect = lineBox.getBoundingClientRect();
        if (rect.bottom > (rootRect.bottom - bottomSpace)) {
          overflow = lineBox;
          overflowIndex = lineBoxes.length;
        }
      }
      if (overflow && lineBoxes.length > overflowIndex + widows - 1) {
        break;
      }
      lineBoxes.push(lineBox);
    }

    if (overflowIndex !== undefined) {
      if (overflowIndex < orphans) {
        // Insufficient orphans
        return null;
      }

      lineBoxes = lineBoxes.slice(orphans);
    }

    const breakOnLineBox = lineBoxes[lineBoxes.length - widows];

    if (!breakOnLineBox) {
      return null;
    }

    const range = new Range();
    range.setStart(breakOnLineBox.startContainer, breakOnLineBox.startOffset);
    range.setEndAfter(root.lastChild);
    return range;
  }

  get firstText() {
    return this.texts[0];
  }

  get lastText() {
    return this.texts[this.texts.length - 1];
  }
}
