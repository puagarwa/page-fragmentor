export class BaseBreakPoint {
  constructor({ rectFilter, nodeRules, root }) {
    this.rectFilter = rectFilter;
    this.nodeRules = nodeRules;
    this.root = root;
  }

  get force() {
    return false;
  }

  get avoid() {
    return false;
  }

  get overflowing() {
    return this.root.scrollHeight > this.root.clientHeight;
  }

  range() {
    return null;
  }

  get rootRect() {
    return this.rectFilter.get(this.root);
  }
}
