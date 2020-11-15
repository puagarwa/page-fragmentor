import { breakPointGenerator } from './break_point_generator';

export function extractOverflow(root, config) {
  const breakPointIterator = breakPointGenerator(root);

  const breakPoints = [];
  for (const breakPoint of breakPointIterator) {
    breakPoints.unshift(breakPoint);
    if (breakPoint.overflowing) {
      break;
    }
  }
  if (!breakPoints[0]?.overflowing) {
    return null;
  }

  // First with all rules
  for (const breakPoint of breakPoints) {
    if (breakPoint.overflowing) {
      continue;
    }
    const range = breakPoint.range(root);
    if (range) {
      return range.extractContents();
    }
  }

  // Allow overflow
  for (const breakPoint of breakPoints) {
    const range = breakPoint.range(root);
    if (range) {
      return range.extractContents();
    }
  }
  return null;
}
