export class RectFilter extends Map {
  get(node) {
    if (this.has(node)) {
      return super.get(node);
    }
    let rect;
    if (node.nodeType === Node.TEXT_NODE) {
      const range = new Range();
      range.selectNode(node);
      rect = range.getBoundingClientRect();
    } else {
      rect = node.getBoundingClientRect();
    }
    this.set(node, rect);
    return rect;
  }

  acceptNode(node) {
    const rect = this.get(node);
    if (rect.height === 0) {
      return NodeFilter.FILTER_REJECT;
    }
    return NodeFilter.FILTER_ACCEPT;
  }
}
