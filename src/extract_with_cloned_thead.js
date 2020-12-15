import { uuid } from './uuid';

function findAndMarkTables(range) {
  const tables = [];
  let cursor = range.startContainer;
  if (cursor.nodeType === Node.TEXT_NODE) {
    cursor = cursor.parentNode;
  }
  cursor = cursor.closest('table');
  while (cursor) {
    cursor.dataset.tableUuid = uuid();
    cursor.classList.add('fix-table-layout');
    tables.push(cursor);
    cursor = cursor.parentNode.closest('table');
  }
  return tables;
}

/**
 * Extract a range
 * If the range is part of a table
 *   - Clone headers
 *   - Switch the table to a fixed layout
 */
export function extractWithClonedTHead(range) {
  const tables = findAndMarkTables(range);
  const contents = range.extractContents();
  tables.forEach((table) => {
    if (!table.tHead) {
      return;
    }
    const newTable = contents.querySelector(`table[data-table-uuid="${table.dataset.tableUuid}"]`);
    if (newTable && !newTable.tHead) {
      newTable.tHead = table.tHead.cloneNode(true);
      newTable.classList.remove('fix-table-layout');
    }
  });
  return contents;
}
