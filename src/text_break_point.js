import { BaseBreakPoint } from './base_break_point';
import { lineBoxGenerator } from './line_box_generator';

export class TextBreakPoint extends BaseBreakPoint {
  constructor() {
    super();
    this.texts = [];
  }

  add(node, { avoid, orphans, widows }) {
    this.texts.push(node);
    this.avoid ??= avoid;
    this.orphans ??= orphans;
    this.widows ??= widows;
  }

  range(root) {
    const rootRect = root.getBoundingClientRect();
    const lineBoxes = [];
    let overflow = false;
    for (const lineBox of lineBoxGenerator(this.texts)) {
      if (!overflow) {
        const rect = lineBox.getBoundingClientRect();
        if (rect.bottom > rootRect.bottom) {
          overflow = lineBox;
          break;
        }
      }
      if (overflow && lineBoxes.length >= this.widows + this.orphans) {
        break;
      }
      lineBoxes.push(lineBox);
    }

    let lastLineBox;
    for (const lineBox of lineBoxes.slice(this.orphans, -this.widows || undefined)) {
      if (lineBox === overflow) {
        break;
      }
      lastLineBox = lineBox;
    }

    if (!lastLineBox) {
      return null;
    }

    const range = new Range();
    range.setEndAfter(root.lastChild);
    range.setStart(lastLineBox.startContainer, lastLineBox.startOffset);
    return range;
  }
}
