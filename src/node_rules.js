export class NodeRules extends Map {
  get(node) {
    if (node instanceof Text) {
      return this.get(node.parentNode);
    }
    if (!(node instanceof Element)) {
      return {
        inheritedAvoid: false,
        orphans: 2,
        widows: 2,
      };
    }
    if (this.has(node)) {
      return super.get(node);
    }
    const rule = this.findInheritedRule(node);
    this.set(node, rule);
    return rule;
  }

  findInheritedRule(node) {
    const parentRule = this.get(node.parentNode);
    const styles = window.getComputedStyle(node);
    return {
      inheritedAvoid: ['avoid', 'avoid-page'].includes(styles.getPropertyValue('break-inside')) || parentRule.inheritedAvoid,
      breakAfter: styles.getPropertyValue('break-after'),
      breakBefore: styles.getPropertyValue('break-before'),
      orphans: parseInt(styles.getPropertyValue('--orphans') || styles.getPropertyValue('orphans') || 2, 10),
      widows: parseInt(styles.getPropertyValue('--widows') || styles.getPropertyValue('widows') || 2, 10),
    };
  }
}
