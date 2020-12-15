import { BaseBreakPoint } from './base_break_point';

export class TrailingBreakPoint extends BaseBreakPoint {
  add(node, { inheritedAvoid, breakAfter }) {
    this.node = node;
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
