import { BaseBreakPoint } from './base_break_point';

export class SiblingBreakPoint extends BaseBreakPoint {
  constructor() {
    super();
    this.lastTrailingNode = null;
  }

  addLeading(node, { inheritedAvoid, breakBefore }) {
    this.node ??= this.lastTrailingNode;

    if (inheritedAvoid) {
      this.inheritedAvoid = true;
    }

    if (['avoid', 'avoid-page'].includes(breakBefore)) {
      this.avoid = true;
    }
    if (breakBefore === 'page') {
      this.force = true;
    }
  }

  addTrailing(node, { inheritedAvoid, breakAfter }) {
    this.lastTrailingNode = node;

    if (inheritedAvoid) {
      this.inheritedAvoid = true;
    }

    if (['avoid', 'avoid-page'].includes(breakAfter)) {
      this.avoid = true;
    }
    if (breakAfter === 'page') {
      this.force = true;
    }
  }

  range(root, disableRules = []) {
    if (!this.node) {
      return null;
    }
    if (!disableRules.includes(2) && this.inheritedAvoid) {
      return null;
    }
    if (!disableRules.includes(1) && this.avoid) {
      return null;
    }

    const range = new Range();
    range.setStartAfter(this.node);
    range.setEndAfter(root.lastChild);
    return range;
  }
}
