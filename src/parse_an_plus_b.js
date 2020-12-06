function parseItem(string) {
  if (string === 'even') {
    return (n) => 2 * n;
  }
  if (string === 'odd') {
    return (n) => 2 * n + 1;
  }
  const matchBPart = /^([+-])?([0-9]+)$/.exec(string);
  if (matchBPart) {
    return () => (
      parseInt(matchBPart[2], 10) * (matchBPart[1] === '-' ? -1 : 1)
    );
  }
  const matchFull = /^([+-])?([0-9]+)n(?:\s*([+-]?)\s*([0-9]+))?$/.exec(string);
  if (!matchFull) {
    throw new Error(`${string} is not a valid an+b selector`);
  }
  return (n) => {
    const a = parseInt(matchFull[2], 10) * matchFull[1] === '-' ? -1 : 1;
    const b = parseInt(matchFull[4], 10) || 0 * (matchFull[3] === '-1' ? -1 : 1);
    return a * n + b;
  };
}

function matchAnPlusB(fn, index) {
  for (let count = 0; true; count += 1) { // eslint-disable-line no-constant-condition
    const value = fn(count);
    if (value === index) {
      return true;
    }
    if (value > index) {
      return false;
    }
  }
}

export function parseAnPlusB(string = '') {
  const fns = string.split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map(parseItem);

  return (count) => fns.every((fn) => matchAnPlusB(fn, count));
}
