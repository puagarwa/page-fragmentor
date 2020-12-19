import { uuid } from '../uuid';

function findAndMarkTables(range) {
  const tables = [];
  let cursor = range.startContainer;
  if (cursor.nodeType === Node.TEXT_NODE) {
    cursor = cursor.parentNode;
  }
  cursor = cursor.closest('table');
  while (cursor) {
    cursor.dataset.uuid = uuid();
    cursor.classList.add('fix-table-layout');
    tables.push(cursor);
    cursor = cursor.parentNode.closest('table');
  }
  return tables;
}

export class TableExtractor {
  before(range) {
    this.tables = findAndMarkTables(range);
  }

  after(fragment) {
    this.tables.forEach((table) => {
      if (!table.tHead) {
        return;
      }
      const newTable = fragment.querySelector(`table[data-uuid="${table.dataset.uuid}"]`);
      if (newTable && !newTable.tHead) {
        newTable.tHead = table.tHead.cloneNode(true);
        newTable.classList.remove('fix-table-layout');
      }
    });
  }
}
