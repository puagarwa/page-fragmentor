import { nodeGenerator } from './node_generator';
import { RectFilter } from '../caches/rect_filter_cache';
import { BaseBreakPoint } from '../break_points/base_break_point';
import { InlineBreakPoint } from '../break_points/inline_break_point';
import { SiblingBreakPoint } from '../break_points/sibling_break_point';
import { NodeRules } from '../caches/node_rule_cache';

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
  const saxIterator = nodeGenerator(root, rectFilter);
  const nodeRules = new NodeRules();

  let currentBreakPoint = new SiblingBreakPoint({ root, nodeRules, rectFilter });
  let lastType;

  for (const [type, node] of saxIterator) {
    switch (type) {
      case 'enter': {
        if (lastType === 'inline') {
          const lastBreakPoint = currentBreakPoint;
          yield currentBreakPoint;

          currentBreakPoint = new SiblingBreakPoint({ root, nodeRules, rectFilter });
          currentBreakPoint.trailingNodes.push(lastBreakPoint.lastNode);
        }
        currentBreakPoint.leadingNodes.push(node);
        break;
      }

      case 'inline': {
        if (lastType === 'exit') {
          currentBreakPoint.leadingNodes.push(node);
        }
        if (lastType !== type) {
          yield currentBreakPoint;
          currentBreakPoint = new InlineBreakPoint({ root, nodeRules, rectFilter });
        }
        currentBreakPoint.nodes.push(node);
        break;
      }

      case 'exit': {
        if (lastType !== type) {
          yield currentBreakPoint;
          currentBreakPoint = new SiblingBreakPoint({ root, nodeRules, rectFilter });
        }
        currentBreakPoint.trailingNodes.push(node);
        break;
      }

      default:
        throw new Error(`unexpected node type ${type}`);
    }

    lastType = type;
  }

  yield currentBreakPoint;

  // If the last node is a next node and we are overflowing we may need to force a breakpoint
  currentBreakPoint = new BaseBreakPoint({ root, nodeRules, rectFilter });
  yield currentBreakPoint;
}
