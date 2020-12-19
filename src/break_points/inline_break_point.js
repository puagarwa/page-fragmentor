import { BaseBreakPoint } from './base_break_point';
import { lineBoxGenerator } from '../generators/line_box_generator';

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

export class InlineBreakPoint extends BaseBreakPoint {
  constructor() {
    super();
    this.nodes = [];
    this.firstOverflowingNode = null;
  }

  addNode(node, { inheritedAvoid, orphans, widows }) {
    this.nodes.push(node);
    this.inheritedAvoid ??= inheritedAvoid;
    this.orphans ??= orphans;
    this.widows ??= widows;
  }

  range(root, disableRules = []) {
    if (!disableRules.includes(4) && this.inheritedAvoid) {
      return null;
    }

    const lineBoxRange = this.findLineBoxRange(root, disableRules.includes(3));
    const overflowingNodeRange = this.findFirstOverflowingNodeRange();

    let overflowing = lineBoxRange || overflowingNodeRange;

    if (lineBoxRange && overflowingNodeRange) {
      if (lineBoxRange.compareBoundaryPoints(Range.START_TO_START, overflowingNodeRange) === 1) {
        overflowing = lineBoxRange;
      } else {
        overflowing = overflowingNodeRange;
      }
    }

    if (!overflowing) {
      return null;
    }

    const range = new Range();
    range.setStart(overflowing.startContainer, overflowing.startOffset);
    range.setEndAfter(root.lastChild);
    return range;
  }

  findLineBoxRange(root, relaxWidowsAndOrphans) {
    let { widows, orphans } = this;

    if (relaxWidowsAndOrphans) {
      widows = 1;
      orphans = 1;
    }

    if (!this.firstText) {
      return null;
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

    return lineBoxes[lineBoxes.length - widows] || null;
  }

  findFirstOverflowingNodeRange() {
    if (!this.firstOverflowingNode) {
      return null;
    }
    const range = new Range();
    range.setStartBefore(this.firstOverflowingNode);
    return range;
  }

  set widows(value) {
    if (value < 1) {
      return;
    }
    this._widows = value;
  }

  get widows() {
    return this._widows || 2;
  }

  set orphans(value) {
    if (value < 1) {
      return;
    }
    this._orphans = value;
  }

  get orphans() {
    return this._orphans || 2;
  }

  get firstNode() {
    return this.nodes[0];
  }

  get firstText() {
    return this.nodes.find((node) => node.nodeType === Node.TEXT_NODE);
  }

  get lastNode() {
    return this.nodes[this.nodes.length - 1];
  }

  get lastText() {
    return [...this.nodes].reverse().find((node) => node.nodeType === Node.TEXT_NODE);
  }
}
