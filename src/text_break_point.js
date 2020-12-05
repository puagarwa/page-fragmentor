import { BaseBreakPoint } from './base_break_point';
import { lineBoxGenerator } from './line_box_generator';

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

  extract(root, disableRules = []) {
    if (!disableRules.includes(4) && this.inheritedAvoid) {
      return null;
    }
    const rootRect = root.getBoundingClientRect();
    const lineBoxes = [];
    let overflow = false;
    let overflowIndex;
    let { widows, orphans } = this;
    if (disableRules.includes(3)) {
      widows = 0;
      orphans = 0;
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

    let lastLineBox;
    for (const lineBox of lineBoxes.slice(orphans, -widows || undefined)) {
      lastLineBox = lineBox;
      if (lineBox === overflow) {
        break;
      }
    }

    if (!lastLineBox) {
      return null;
    }

    const range = new Range();
    range.setStart(lastLineBox.startContainer, lastLineBox.startOffset);
    range.setEndAfter(root.lastChild);
    return this.extractWithTHead(range);
  }
}
