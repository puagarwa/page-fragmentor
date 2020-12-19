import { breakPointGenerator } from './generators/break_point_generator';

export function getOverflowingRange(root) {
  const breakPointIterator = breakPointGenerator(root);

  const breakPoints = [];
  let overflowing = false;
  for (const breakPoint of breakPointIterator) {
    // Always use the first forced breakpoint
    if (!overflowing && breakPoint.force && !breakPoint.overflowing) {
      const range = breakPoint.range(root);
      if (range) {
        return range;
      }
    }

    if (!overflowing && breakPoint.overflowing) {
      overflowing = true;

      // Find the last useable breakpoint
      // Retrying with relaxed rules
      // https://www.w3.org/TR/css-break-3/#unforced-breaks
      for (const disableRules of [[], [3], [1, 3], [1, 2, 3], [1, 2, 3, 4]]) {
        for (const previousBreakPoint of breakPoints) {
          const range = previousBreakPoint.range(root, disableRules);
          if (range) {
            return range;
          }
        }
      }
    }

    if (!overflowing) {
      breakPoints.unshift(breakPoint);
    } else {
      // No break point found.  We are overflowing
      // Use the next break point with any result
      const range = breakPoint.range(root, [1, 2, 3, 4]);
      if (range) {
        return range;
      }
    }
  }

  return null;
}
