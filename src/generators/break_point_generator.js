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
 */
export function* breakPointGenerator(root) {
  const rectFilter = new RectFilter();
  const nodeIterator = nodeGenerator(root, rectFilter);
  const nodeRules = new NodeRules();

  let currentBreakPoint = new SiblingBreakPoint({ root, nodeRules, rectFilter });
  let lastType;

  for (const [type, node] of nodeIterator) {
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

  // If the last node is a text node and we are overflowing we may need to force a breakpoint
  currentBreakPoint = new BaseBreakPoint({ root, nodeRules, rectFilter });
  yield currentBreakPoint;
}
