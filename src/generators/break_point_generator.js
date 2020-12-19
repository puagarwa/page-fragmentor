import { nodeGenerator } from './node_generator';
import { RectFilter } from '../rect_filter';
import { BaseBreakPoint } from '../break_points/base_break_point';
import { InlineBreakPoint } from '../break_points/inline_break_point';
import { SiblingBreakPoint } from '../break_points/sibling_break_point';
import { NodeRules } from '../node_rules';

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
  const rootRect = root.getBoundingClientRect();
  const nodeRules = new NodeRules();

  let currentBreakPoint = new SiblingBreakPoint();
  let lastType;
  let firstUseableNode;

  for (const [type, node] of saxIterator) {
    const rule = nodeRules.get(node);
    firstUseableNode ??= node;

    switch (type) {
      case 'enter': {
        if (lastType === 'inline') {
          const lastBreakPoint = currentBreakPoint;
          yield currentBreakPoint;

          currentBreakPoint = new SiblingBreakPoint();
          currentBreakPoint.addTrailing(lastBreakPoint.lastNode, {});
        }
        currentBreakPoint.addLeading(node, rule);

        const rect = rectFilter.get(node);
        if (rect.top > rootRect.bottom) {
          currentBreakPoint.overflowing = true;
        }

        break;
      }

      case 'inline': {
        if (lastType === 'exit') {
          currentBreakPoint.addLeading(node, rule);
        }
        if (lastType !== type) {
          yield currentBreakPoint;
          currentBreakPoint = new InlineBreakPoint();
        }
        currentBreakPoint.addNode(node, rule);

        if (currentBreakPoint.nodes.length === 1) {
          const rect = rectFilter.get(node);
          if (rect.top > rootRect.bottom) {
            currentBreakPoint.overflowing = true;
          }
        }

        if (node !== firstUseableNode
          && !currentBreakPoint.firstOverflowingNode
          && node.nodeType === Node.ELEMENT_NODE
        ) {
          const rect = rectFilter.get(node);
          const style = window.getComputedStyle(node);
          const bottom = Math.ceil(rect.bottom + (parseFloat(style.marginBottom) || 0));
          if (bottom > Math.floor(rootRect.bottom)) {
            currentBreakPoint.firstOverflowingNode = node;
          }
        }

        break;
      }

      case 'exit': {
        if (lastType !== type) {
          yield currentBreakPoint;
          currentBreakPoint = new SiblingBreakPoint();
        }
        currentBreakPoint.addTrailing(node, rule);

        const rect = rectFilter.get(node);
        const style = window.getComputedStyle(node);
        const bottom = Math.ceil(rect.bottom + (parseFloat(style.marginBottom) || 0));
        if (bottom > Math.floor(rootRect.bottom)) {
          currentBreakPoint.overflowing = true;
        }

        break;
      }

      default:
        throw new Error(`unexpected node type ${type}`);
    }

    lastType = type;
  }

  yield currentBreakPoint;

  // If the last node is a next node and we are overflowing we may need to force a breakpoint
  currentBreakPoint = new BaseBreakPoint();
  currentBreakPoint.overflowing = root.scrollHeight > root.clientHeight;
  yield currentBreakPoint;
}
