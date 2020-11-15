import { BaseBreakPoint } from './base_break_point';

export class TrailingBreakPoint extends BaseBreakPoint {
  add(node, { inheritedAvoid, breakAfter }) {
    this.node = node;
    if (inheritedAvoid || breakAfter === 'avoid') {
      this.avoid = true;
    }
    if (breakAfter === 'page') {
      this.force = true;
    }
  }

  range(root) {
    const range = new Range();
    range.setEndAfter(root.lastChild);
    range.setStartAfter(this.node);
    return range;
  }
}
