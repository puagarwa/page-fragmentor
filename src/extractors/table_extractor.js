import { uuid } from '../uuid';

function fixTable(table) {
  // If the table already has cols, don't add new ones
  if (!table.querySelector('col')) {
    const columns = [...table.rows[0].cells].reduce((total, cell) => total + cell.colSpan, 0);

    for (let i = 0; i < columns; i += 1) {
      const col = document.createElement('col');
      col.dataset.fragmenationCol = true;
      table.prepend(col);
    }
  }

  // Fix the widths of the columns
  [...table.querySelectorAll('col')].forEach((col) => {
    const rect = col.getBoundingClientRect();
    // eslint-disable-next-line no-param-reassign
    col.style.width = `${rect.width}px`;
  });
}

function findAndMarkTables(range) {
  const tables = [];
  let cursor = range.startContainer;
  if (cursor.nodeType === Node.TEXT_NODE) {
    cursor = cursor.parentNode;
  }
  cursor = cursor.closest('table');
  while (cursor) {
    cursor.dataset.fragmentationUuid = uuid();
    fixTable(cursor);
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
      const newTable = fragment.querySelector(`table[data-fragmentation-uuid="${table.dataset.fragmentationUuid}"]`);
      if (!newTable) {
        return;
      }
      // Remove fixed widths
      [...table.querySelectorAll('col[data-fragmentation-col]')].forEach((col) => col.remove());
      // Add in thead
      if (!newTable.tHead && table.tHead) {
        newTable.tHead = table.tHead.cloneNode(true);
      }
      // Remove duplicated uuid
      delete newTable.dataset.fragmentationUuid;
    });
  }
}
