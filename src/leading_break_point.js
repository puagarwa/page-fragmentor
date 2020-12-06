import { BaseBreakPoint } from './base_break_point';

export class LeadingBreakPoint extends BaseBreakPoint {
  add(node, { inheritedAvoid, breakBefore }) {
    this.node ??= node;
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

  extract(root, disableRules = []) {
    if (!disableRules.includes(2) && this.inheritedAvoid) {
      return null;
    }
    if (!disableRules.includes(1) && this.avoid) {
      return null;
    }

    const range = new Range();
    range.setStartBefore(this.node);
    range.setEndAfter(root.lastChild);
    return this.extractWithTHead(range);
  }
}
