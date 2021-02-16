import { parsePageSize } from './parse_page_size';

describe('no value', () => {
  it.jestPlaywrightSkip(
    {
      browsers: ['webkit', 'firefox'],
    },
    'parses an empty string to A4 portrait', () => {
      expect(parsePageSize('')).toEqual(['210mm', '297mm']);
    });

  it.jestPlaywrightSkip(
    {
      browsers: ['webkit', 'firefox'],
    },
    'parses a whitespace string to A4 portrait', () => {
      expect(parsePageSize(' ')).toEqual(['210mm', '297mm']);
    });
});

describe('auto', () => {
  it.jestPlaywrightSkip(
    {
      browsers: ['webkit', 'firefox'],
    },
    'parses auto to A4 portrait', () => {
      expect(parsePageSize('auto')).toEqual(['210mm', '297mm']);
    });
});

describe('named sizes', () => {
  it.jestPlaywrightSkip(
    {
      browsers: ['webkit', 'firefox'],
    },
    'parses "portrait" to A4 portrait', () => {
      expect(parsePageSize('auto')).toEqual(['210mm', '297mm']);
    });

  it.jestPlaywrightSkip(
    {
      browsers: ['webkit', 'firefox'],
    },
    'parses "landscape" to A4 landscape', () => {
      expect(parsePageSize('landscape')).toEqual(['297mm', '210mm']);
    });

  it.jestPlaywrightSkip(
    {
      browsers: ['webkit', 'firefox'],
    },
    'parses "A4" to A4 portrait', () => {
      expect(parsePageSize('A4')).toEqual(['210mm', '297mm']);
    });

  it.jestPlaywrightSkip(
    {
      browsers: ['webkit', 'firefox'],
    },
    'parses "A4 portrait" to A4 portrait', () => {
      expect(parsePageSize('A4 portrait')).toEqual(['210mm', '297mm']);
    });

  it.jestPlaywrightSkip(
    {
      browsers: ['webkit', 'firefox'],
    },
    'parses " A4 portrait" to A4 portait', () => {
      expect(parsePageSize(' A4 portrait')).toEqual(['210mm', '297mm']);
    });

  it.jestPlaywrightSkip(
    {
      browsers: ['webkit', 'firefox'],
    },
    'parses "A4  portrait" to A4 portait', () => {
      expect(parsePageSize(' A4 portrait')).toEqual(['210mm', '297mm']);
    });

  it.jestPlaywrightSkip(
    {
      browsers: ['webkit', 'firefox'],
    },
    'parses "A4 landscape" to A4 landscape', () => {
      expect(parsePageSize('A4 landscape')).toEqual(['297mm', '210mm']);
    });

  it.jestPlaywrightSkip(
    {
      browsers: ['webkit', 'firefox'],
    },
    'parses "A5" to A5 portrait', () => {
      expect(parsePageSize('A5')).toEqual(['148mm', '210mm']);
    });

  it.jestPlaywrightSkip(
    {
      browsers: ['webkit', 'firefox'],
    },
    'parses "A5 landscape" to A5 landscape', () => {
      expect(parsePageSize('A5 landscape')).toEqual(['210mm', '148mm']);
    });

  it.jestPlaywrightSkip(
    {
      browsers: ['webkit', 'firefox'],
    },
    'parses "A3" to A3 portrait', () => {
      expect(parsePageSize('A3')).toEqual(['297mm', '420mm']);
    });

  it.jestPlaywrightSkip(
    {
      browsers: ['webkit', 'firefox'],
    },
    'parses "B5" to B5 portrait', () => {
      expect(parsePageSize('B5')).toEqual(['176mm', '250mm']);
    });

  it.jestPlaywrightSkip(
    {
      browsers: ['webkit', 'firefox'],
    },
    'parses "B4" to B4 portrait', () => {
      expect(parsePageSize('B4')).toEqual(['250mm', '353mm']);
    });

  it.jestPlaywrightSkip(
    {
      browsers: ['webkit', 'firefox'],
    },
    'parses "JIS-B5" to JIS-B5 portrait', () => {
      expect(parsePageSize('JIS-B5')).toEqual(['182mm', '257mm']);
    });

  it.jestPlaywrightSkip(
    {
      browsers: ['webkit', 'firefox'],
    },
    'parses "JIS-B4" to JIS-B4 portrait', () => {
      expect(parsePageSize('JIS-B4')).toEqual(['257mm', '364mm']);
    });

  it.jestPlaywrightSkip(
    {
      browsers: ['webkit', 'firefox'],
    },
    'parses "letter" to letter portrait', () => {
      expect(parsePageSize('letter')).toEqual(['8.5in', '11in']);
    });

  it.jestPlaywrightSkip(
    {
      browsers: ['webkit', 'firefox'],
    },
    'parses "legal" to legal portrait', () => {
      expect(parsePageSize('legal')).toEqual(['8.5in', '14in']);
    });

  it.jestPlaywrightSkip(
    {
      browsers: ['webkit', 'firefox'],
    },
    'parses "ledger" to ledger portrait', () => {
      expect(parsePageSize('ledger')).toEqual(['11in', '17in']);
    });
});

describe('two lengths', () => {
  it.jestPlaywrightSkip(
    {
      browsers: ['webkit', 'firefox'],
    },
    'parses to an array', () => {
      expect(parsePageSize('14cm 15cm')).toEqual(['14cm', '15cm']);
    });

  it.jestPlaywrightSkip(
    {
      browsers: ['webkit', 'firefox'],
    },
    'parses with extra white space', () => {
      expect(parsePageSize('14cm  15cm')).toEqual(['14cm', '15cm']);
    });
});

describe('one length', () => {
  it.jestPlaywrightSkip(
    {
      browsers: ['webkit', 'firefox'],
    },
    'parses to an array', () => {
      expect(parsePageSize('14cm')).toEqual(['14cm', '14cm']);
    });
});
