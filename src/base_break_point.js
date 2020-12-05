import { uuidv4 } from './uuid4';

export class BaseBreakPoint {
  constructor() {
    this.node = null;
    this.avoid = false;
    this.force = false;
    this.overflowing = false;
  }

  extractWithTHead(range) {
    const tables = this.findAndMarkTables(range);
    const contents = range.extractContents();
    tables.forEach((table) => {
      if (!table.tHead) {
        return;
      }
      const newTable = contents.querySelector(`table[data-paged-table="${table.dataset.pagedTable}"]`);
      if (newTable && !newTable.tHead) {
        newTable.tHead = table.tHead.cloneNode(true);
      }
    });
    return contents;
  }

  findAndMarkTables(range) {
    const tables = [];
    let cursor = range.startContainer;
    if (cursor.nodeType === Node.TEXT_NODE) {
      cursor = cursor.parentNode;
    }
    cursor = cursor.closest('table');
    while (cursor) {
      cursor.dataset.pagedTable = uuidv4();
      tables.push(cursor);
      cursor = cursor.parentNode.closest('table');
    }
    return tables;
  }
}
