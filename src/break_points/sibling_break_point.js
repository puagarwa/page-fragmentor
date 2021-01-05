import { BaseBreakPoint } from './base_break_point';

export class SiblingBreakPoint extends BaseBreakPoint {
  constructor(...args) {
    super(...args);
    this.leadingNodes = [];
    this.trailingNodes = [];
  }

  get force() {
    return (this._force ??= this.leadingNodes.some((node) => this.nodeRules.get(node).breakBefore === 'page')
      || this.trailingNodes.some((node) => this.nodeRules.get(node).breakAfter === 'page'));
  }

  get overflowing() {
    return this.leadingNodes.some(this.hasLeadingOverflow, this)
      || this.trailingNodes.some(this.hasTrailingOverflow, this);
  }

  range(disableBreakRules = []) {
    const { node, force, avoid } = this;

    if (!node || (node === Node.ELEMENT_NODE && node.matches('td,th'))) {
      return null;
    }
    if (!force && !disableBreakRules.includes(2) && this.nodeRules.get(node).breakInsideAvoid) {
      return null;
    }
    if (!force && !disableBreakRules.includes(1) && avoid) {
      return null;
    }

    const range = new Range();
    range.setStartAfter(node);
    range.setEndAfter(this.root.lastChild);
    return range;
  }

  get avoid() {
    return this.leadingNodes.some((node) => ['avoid', 'avoid-page'].includes(this.nodeRules.get(node).breakBefore))
      || this.trailingNodes.some((node) => ['avoid', 'avoid-page'].includes(this.nodeRules.get(node).breakAfter));
  }

  get node() {
    return this.trailingNodes[this.trailingNodes.length - 1];
  }

  hasLeadingOverflow(node) {
    const rect = this.rectFilter.get(node);
    return rect.top > this.rootRect.bottom;
  }

  hasTrailingOverflow(node) {
    const rect = this.rectFilter.get(node);
    const style = node.nodeType === Node.ELEMENT_NODE ? window.getComputedStyle(node) : {};
    const bottom = Math.ceil(rect.bottom + (parseFloat(style.marginBottom) || 0));
    return bottom > Math.floor(this.rootRect.bottom);
  }
}
