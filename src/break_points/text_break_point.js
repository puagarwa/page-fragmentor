import { BaseBreakPoint } from './base_break_point';
import { lineBoxGenerator } from '../line_box_generator';

export class TextBreakPoint extends BaseBreakPoint {
  constructor() {
    super();
    this.texts = [];
  }

  add(node, { inheritedAvoid, orphans, widows }) {
    this.texts.push(node);
    this.inheritedAvoid ??= inheritedAvoid;
    this.orphans ??= orphans;
    this.widows ??= widows;
  }

  range(root, disableRules = []) {
    if (!disableRules.includes(4) && this.inheritedAvoid) {
      return null;
    }
    const rootRect = root.getBoundingClientRect();
    let lineBoxes = [];
    let overflow = false;
    let overflowIndex;
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
    for (const lineBox of lineBoxGenerator(this.texts)) {
      if (!overflow) {
        const rect = lineBox.getBoundingClientRect();
        if (rect.bottom > rootRect.bottom) {
          overflow = lineBox;
          overflowIndex = lineBoxes.length;
        }
      }
      if (overflow && lineBoxes.length > overflowIndex + widows) {
        break;
      }
      lineBoxes.push(lineBox);
    }

    if (orphans) {
      lineBoxes = lineBoxes.slice(orphans);
    }

    if (widows > 1) {
      lineBoxes = lineBoxes.slice(0, -widows + 1);
    }

    let lastLineBox;
    for (const lineBox of lineBoxes) {
      if (lineBox === overflow) {
        break;
      }
      lastLineBox = lineBox;
    }

    if (!lastLineBox) {
      return null;
    }

    const range = new Range();
    range.setStart(lastLineBox.startContainer, lastLineBox.startOffset);
    range.setEndAfter(root.lastChild);
    return range;
  }
}
