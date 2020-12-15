import { BaseBreakPoint } from './base_break_point';

/**
 * A break point that is never allowed
 */
export class DisallowedBreakPoint extends BaseBreakPoint {
  add() {
    // Ignore
  }

  range() {
    return null;
  }
}
