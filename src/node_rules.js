export class NodeRules extends Map {
  constructor({ defaultWidows = 2, defaultOrphans = 2, rules = [] } = {}) {
    super();
    this.rules = rules;
    this.defaultWidows = defaultWidows;
    this.defaultOrphans = defaultOrphans;
  }

  get(node) {
    if (node instanceof Text) {
      return this.get(node.parentNode);
    }
    if (!(node instanceof Element)) {
      return {
        inheritedAvoid: false,
        orphans: this.defaultOrphans,
        widows: this.defaultWidows,
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
    const rule = this.findRule(node);
    const parentRule = this.get(node.parentNode);
    return {
      ...rule,
      inheritedAvoid: rule.breakInside === 'avoid' || parentRule.avoid,
      orphans: rule.orphans ?? parentRule.orphans,
      widows: rule.widows ?? parentRule.widows,
    };
  }

  findRule(node) {
    return this.rules.find(({ selector }) => node.matches(selector)) ?? {};
  }
}
