import { breakPointGenerator } from './break_point_generator';

export function extractOverflow(root, config) {
  const breakPointIterator = breakPointGenerator(root, config);

  const breakPoints = [];
  let overflowBreakPoint;
  for (const breakPoint of breakPointIterator) {
    if (breakPoint.overflowing) {
      overflowBreakPoint = breakPoint;
      break;
    }
    if (!breakPoint.overflowing && breakPoint.force) {
      const extracted = breakPoint.extract(root);
      if (extracted) {
        return extracted;
      }
    }
    breakPoints.unshift(breakPoint);
  }

  // https://www.w3.org/TR/css-break-3/#unforced-breaks
  for (const disableRules of [[], [3], [1, 3], [1, 2, 3], [1, 2, 3, 4]]) {
    for (const breakPoint of breakPoints) {
      const extracted = breakPoint.extract(root, disableRules);
      if (extracted) {
        return extracted;
      }
    }
  }

  // Force next overflowing breakpoint
  if (overflowBreakPoint) {
    return breakPoints[0].extract(root, [1, 2, 3, 4]);
  }
  return null;
}
