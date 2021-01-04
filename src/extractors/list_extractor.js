import { uuid } from '../uuid';

function visibleListItem(node) {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }

  return node.matches('li') && node.getBoundingClientRect().height > 0;
}

function findAndMarkLists(range) {
  const lists = [];
  let cursor = range.startContainer;
  if (cursor.nodeType === Node.TEXT_NODE) {
    cursor = cursor.parentNode;
  }
  cursor = cursor.closest('ol');
  while (cursor) {
    cursor.dataset.fragmentationUuid = uuid();
    lists.push(cursor);
    if (cursor.reversed) {
      const items = [...cursor.childNodes].filter(visibleListItem).length;
      cursor.start = items;
    }
    cursor = cursor.parentNode.closest('ol');
  }
  return lists;
}

export class ListExtractor {
  before(range) {
    this.lists = findAndMarkLists(range);
  }

  after(fragment) {
    this.lists.forEach((list) => {
      const items = [...list.childNodes].filter(visibleListItem).length;
      const newList = fragment.querySelector(`ol[data-fragmentation-uuid="${list.dataset.fragmentationUuid}"]`);
      if (newList) {
        if (newList.reversed) {
          newList.start = list.start - items;
        } else {
          newList.start = list.start + items;
        }
        delete newList.dataset.fragmentationUuid;
      }
    });
  }
}
