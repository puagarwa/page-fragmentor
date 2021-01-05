import { BaseBreakPoint } from './base_break_point';
import { lineBoxGenerator } from '../generators/line_box_generator';

function calculateBottomSpace(container) {
  const style = window.getComputedStyle(container);
  const size = (parseFloat(style.paddingBottom) || 0)
    + (parseFloat(style.borderBottomWidth) || 0)
    + (parseFloat(style.marginBottom) || 0);

  return Math.ceil(Math.max(size, 0));
}

/**
 * Represents a class B breakpoint
 */
export class InlineBreakPoint extends BaseBreakPoint {
  constructor(...args) {
    super(...args);
    this.nodes = [];
  }

  get overflowing() {
    const rect = this.rectFilter.get(this.firstNode);
    return rect.top > this.rootRect.bottom;
  }

  range(disableBreakRules = []) {
    if (!disableBreakRules.includes(4) && this.containerRules.breakInsideAvoid) {
      return null;
    }

    const lineBoxRange = this.findLineBoxRange(disableBreakRules.includes(3));
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
    range.setEndAfter(this.root.lastChild);
    return range;
  }

  // Internals
  // ---------

  // Find the first overflowing linebox obeying widow and orphan rules
  findLineBoxRange(relaxWidowsAndOrphans) {
    let { widows, orphans } = this.containerRules;

    widows = widows || 2;
    orphans = orphans || 2;

    if (relaxWidowsAndOrphans) {
      widows = 1;
      orphans = 1;
    }

    let lineBoxes = [];
    let overflow = false;
    let overflowIndex;

    for (const lineBox of lineBoxGenerator(this.nodes)) {
      if (!overflow) {
        const rect = lineBox.getBoundingClientRect();
        if (rect.bottom > (this.rootRect.bottom - this.bottomSpace)) {
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

  // Find the first overflowing element
  // If it is not a text node, and not the first node return it
  findFirstOverflowingNodeRange() {
    const foundNode = this.nodes.find((node) => {
      const rect = this.rectFilter.get(node);
      return rect.bottom > (this.rootRect.bottom - this.bottomSpace);
    });

    if (!foundNode || foundNode.nodeType === Node.TEXT_NODE || foundNode === this.firstNode) {
      return null;
    }
    const range = new Range();
    range.setStartBefore(foundNode);
    return range;
  }

  get container() {
    if (this._container) {
      return this._container;
    }
    const range = new Range();
    range.setStartBefore(this.firstNode);
    range.setEndAfter(this.lastNode);
    let container = range.commonAncestorContainer;
    if (container.nodeType === Node.TEXT_NODE) {
      container = container.parentNode;
    }
    this._container = container;
    return container;
  }

  get bottomSpace() {
    return (this._bottomSpace ??= calculateBottomSpace(this.container));
  }

  get containerRules() {
    return (this._containerRules ??= this.nodeRules.get(this.container));
  }

  get firstNode() {
    return this.nodes[0];
  }

  get lastNode() {
    return this.nodes[this.nodes.length - 1];
  }
}
