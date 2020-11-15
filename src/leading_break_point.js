import { BaseBreakPoint } from './base_break_point';

export class LeadingBreakPoint extends BaseBreakPoint {
  add(node, { inheritedAvoid, breakBefore }) {
    this.node ??= node;
    if (inheritedAvoid || breakBefore === 'avoid') {
      this.avoid = true;
    }
    if (breakBefore === 'page') {
      this.force = true;
    }
  }

  range(root) {
    const range = new Range();
    range.setEndAfter(root.lastChild);
    range.setStartBefore(this.node);
    return range;
  }
}
