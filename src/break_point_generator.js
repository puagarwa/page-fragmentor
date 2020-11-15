import { saxGenerator } from './sax_generator';
import { RectFilter } from './rect_filter';
import { TextBreakPoint } from './text_break_point';
import { LeadingBreakPoint } from './leading_break_point';
import { TrailingBreakPoint } from './trailing_break_point';
import { DisallowedBreakPoint } from './disallowed_break_point';
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
 *
 * @param {Iterator} iterator saxGenerator iterator instance
 * @param {Integer} options.widows default widow rule
 * @param {Integer} options.orphans default orphans rule
 * @param {Array} rules break rules
 */
export function* breakPointGenerator(root, config) {
  const rectFilter = new RectFilter();
  const saxIterator = saxGenerator(root, rectFilter);
  const rootRect = root.getBoundingClientRect();
  const nodeRules = new NodeRules(config);

  let currentBreakPoint;
  let lastType;

  for (const [type, node] of saxIterator) {
    const rule = nodeRules.get(node);

    if (lastType !== type) {
      // When the type changes we have enough data to emit the breakpoint
      if (currentBreakPoint) {
        yield currentBreakPoint;
      }

      if (!currentBreakPoint) {
        // The first break point is never allowed or you get infinite loops
        currentBreakPoint = new DisallowedBreakPoint();
      } else if (type === 'text') {
        currentBreakPoint = new TextBreakPoint();
      } else if (type === 'enter') {
        currentBreakPoint = new LeadingBreakPoint();
      } else if (type === 'exit') {
        currentBreakPoint = new TrailingBreakPoint();
      }
    }

    if (type === 'enter' || type === 'text') {
      const rect = rectFilter.get(node);
      if (rect.top > rootRect.bottom) {
        currentBreakPoint.overflowing = true;
      }
    }

    if (type === 'exit') {
      const rect = rectFilter.get(node);
      if (rect.bottom > rootRect.bottom) {
        currentBreakPoint.overflowing = true;
      }
    }

    currentBreakPoint.add(node, rule);
    lastType = type;
  }

  if (currentBreakPoint) {
    yield currentBreakPoint;
  }
}
