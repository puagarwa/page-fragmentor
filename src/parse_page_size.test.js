import { parsePageSize } from './parse_page_size';

describe('no value', () => {
  it('parses an empty string to A4 portrait', () => {
    expect(parsePageSize('')).toEqual(['210mm', '297mm']);
  });

  it('parses a whitespace string to A4 portrait', () => {
    expect(parsePageSize(' ')).toEqual(['210mm', '297mm']);
  });
});

describe('auto', () => {
  it('parses auto to A4 portrait', () => {
    expect(parsePageSize('auto')).toEqual(['210mm', '297mm']);
  });
});

describe('named sizes', () => {
  it('parses "portrait" to A4 portrait', () => {
    expect(parsePageSize('auto')).toEqual(['210mm', '297mm']);
  });

  it('parses "landscape" to A4 landscape', () => {
    expect(parsePageSize('landscape')).toEqual(['297mm', '210mm']);
  });

  it('parses "A4" to A4 portrait', () => {
    expect(parsePageSize('A4')).toEqual(['210mm', '297mm']);
  });

  it('parses "A4 portrait" to A4 portrait', () => {
    expect(parsePageSize('A4 portrait')).toEqual(['210mm', '297mm']);
  });

  it('parses " A4 portrait" to A4 portait', () => {
    expect(parsePageSize(' A4 portrait')).toEqual(['210mm', '297mm']);
  });

  it('parses "A4  portrait" to A4 portait', () => {
    expect(parsePageSize(' A4 portrait')).toEqual(['210mm', '297mm']);
  });

  it('parses "A4 landscape" to A4 landscape', () => {
    expect(parsePageSize('A4 landscape')).toEqual(['297mm', '210mm']);
  });

  it('parses "A5" to A5 portrait', () => {
    expect(parsePageSize('A5')).toEqual(['148mm', '210mm']);
  });

  it('parses "A5 landscape" to A5 landscape', () => {
    expect(parsePageSize('A5 landscape')).toEqual(['210mm', '148mm']);
  });

  it('parses "A3" to A3 portrait', () => {
    expect(parsePageSize('A3')).toEqual(['297mm', '420mm']);
  });

  it('parses "B5" to B5 portrait', () => {
    expect(parsePageSize('B5')).toEqual(['176mm', '250mm']);
  });

  it('parses "B4" to B4 portrait', () => {
    expect(parsePageSize('B4')).toEqual(['250mm', '353mm']);
  });

  it('parses "JIS-B5" to JIS-B5 portrait', () => {
    expect(parsePageSize('JIS-B5')).toEqual(['182mm', '257mm']);
  });

  it('parses "JIS-B4" to JIS-B4 portrait', () => {
    expect(parsePageSize('JIS-B4')).toEqual(['257mm', '364mm']);
  });

  it('parses "letter" to letter portrait', () => {
    expect(parsePageSize('letter')).toEqual(['8.5in', '11in']);
  });

  it('parses "legal" to legal portrait', () => {
    expect(parsePageSize('legal')).toEqual(['8.5in', '14in']);
  });

  it('parses "ledger" to ledger portrait', () => {
    expect(parsePageSize('ledger')).toEqual(['11in', '17in']);
  });
});

describe('two lengths', () => {
  it('parses to an array', () => {
    expect(parsePageSize('14cm 15cm')).toEqual(['14cm', '15cm']);
  });

  it('parses with extra white space', () => {
    expect(parsePageSize('14cm  15cm')).toEqual(['14cm', '15cm']);
  });
});

describe('one length', () => {
  it('parses to an array', () => {
    expect(parsePageSize('14cm')).toEqual(['14cm', '14cm']);
  });
});
