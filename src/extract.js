import { TableExtractor } from './extractors/table_extractor';
import { ListExtractor } from './extractors/list_extractor';

/**
 * Extract a range
 * If the range is part of a table
 *   - Clone headers
 *   - Switch the table to a fixed layout
 */
export function extract(range) {
  const extractors = [new TableExtractor(), new ListExtractor()];
  extractors.forEach((extractor) => extractor.before(range));
  const contents = range.extractContents();
  extractors.forEach((extractor) => extractor.after(contents));
  return contents;
}
