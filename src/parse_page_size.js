const rNamedSize = '(A5|A4|A3|B5|B4|JIS-B5|JIS-B4|letter|legal|ledger)';
const rNumber = '((?:\\d*\\.)?\\d+(?:[eE]\\d+)?(?:px|cm|mm|in|pc|pt))';
const rOrientation = '(landscape|portrait)';
const rSize = new RegExp(`^(?:${rNamedSize}(?:\\s+${rOrientation})?)|(?:${rNumber}(?:\\s+${rNumber})?)$`);

const SIZES = {
  A5: ['148mm', '210mm'],
  A4: ['210mm', '297mm'],
  A3: ['297mm', '420mm'],
  B5: ['176mm', '250mm'],
  B4: ['250mm', '353mm'],
  'JIS-B5': ['182mm', '257mm'],
  'JIS-B4': ['257mm', '364mm'],
  letter: ['8.5in', '11in'],
  legal: ['8.5in', '14in'],
  ledger: ['11in', '17in'],
};

// https://www.w3.org/TR/css-page-3/#page-size-prop
export function parsePageSize(size) {
  size = size.trim(); // eslint-disable-line no-param-reassign
  if (!size || size === 'auto') {
    return SIZES.A4;
  }
  const match = rSize.exec(size);
  if (!match) {
    throw new Error(`${size} is not a usable page size`);
  }
  const [, namedSize, orientation, width, height] = match;

  if (namedSize) {
    const matchedSize = SIZES[namedSize];
    if (orientation === 'landscape') {
      return [...matchedSize].reverse();
    }
    return matchedSize;
  }

  return [width, height || width];
}
