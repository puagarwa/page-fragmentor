import { saxGenerator } from './sax_generator';
import { RectFilter } from './rect_filter';
import { TextBreakPoint } from './break_points/text_break_point';
import { SiblingBreakPoint } from './break_points/sibling_break_point';
import { NodeRules } from './node_rules';

/**
 * Yields permissible break points
 *
 * Based on CSS fragmentation Module level 3
 * https://www.w3.org/TR/css-break-3/
 *
 * This is a limited implementation not intended to be compliant:
 *
 * - only page breaks are considered
 * - left, right, recto or verso is not considered
 * - class 3 break points are not considered: https://www.w3.org/TR/css-break-3/#end-block
 * - fragmentation is not optimized to be even, the last allowed break will always be used
 * - box-decoration-break is not supported.  All borders/padding/margin are cloned
 * - borders/padding/margin are never collapsed to prevent overflow: https://www.w3.org/TR/css-break-3/#unforced-breaks
 * - monolithic elements will not be split to prevent overflow
 */
export function* breakPointGenerator(root) {
  const rectFilter = new RectFilter();
  const saxIterator = saxGenerator(root, rectFilter);
  const rootRect = root.getBoundingClientRect();
  const nodeRules = new NodeRules();

  let currentBreakPoint = new SiblingBreakPoint();
  let lastType;

  for (const [type, node] of saxIterator) {
    const rule = nodeRules.get(node);

    if (type === 'enter') {
      if (lastType === 'text') {
        yield currentBreakPoint;
        currentBreakPoint = new SiblingBreakPoint();
      }
      currentBreakPoint.addLeading(node, rule);
    } else if (type === 'text') {
      if (lastType !== type) {
        yield currentBreakPoint;
        currentBreakPoint = new TextBreakPoint();
      }
      currentBreakPoint.addText(node, rule);
    } else if (type === 'exit') {
      if (lastType !== type) {
        yield currentBreakPoint;
        currentBreakPoint = new SiblingBreakPoint();
      }
      currentBreakPoint.addTrailing(node, rule);
    }

    if (type === 'enter' || (type === 'text' && currentBreakPoint.texts.length === 1)) {
      const rect = rectFilter.get(node);
      if (rect.top > rootRect.bottom) {
        currentBreakPoint.overflowing = true;
      }
    }

    if (type === 'exit') {
      const rect = rectFilter.get(node);
      const style = window.getComputedStyle(node);
      const bottom = Math.ceil(rect.bottom + (parseFloat(style.marginBottom) || 0));
      if (bottom > Math.floor(rootRect.bottom)) {
        currentBreakPoint.overflowing = true;
      }
    }

    lastType = type;
  }

  yield currentBreakPoint;
}
