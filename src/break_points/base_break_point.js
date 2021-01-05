/**
 * Represents a possible break point
 *
 * The spec has three types of breakpoints:
 * - Class A: between siblings
 * - Class B: between line-boxes
 * - Class C: between a block and child content edges
 *
 * Only class A and B are supported
 */
export class BaseBreakPoint {
  constructor({ rectFilter, nodeRules, root }) {
    this.rectFilter = rectFilter;
    this.nodeRules = nodeRules;
    this.root = root;
  }

  // A forced breakpoint
  get force() {
    return false;
  }

  // Breakpoint is set to avoid
  get avoid() {
    return false;
  }

  // Breakpoint is overflowing content area
  get overflowing() {
    return this.root.scrollHeight > this.root.clientHeight;
  }

  // Return range of overflowing content
  range() {
    return null;
  }

  // Internals
  // ---------

  get rootRect() {
    return this.rectFilter.get(this.root);
  }
}
