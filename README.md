# @citizensadvice/page-fragmenter

Fragment a HTML page into printable pages.

This will split a page into multiple printable pages with custom headers and footers.
It is intended to be used to create PDFs from HTML with solutions such [Gotenberg][1]
or [Puppeteer][2] / [Playwright][3].

The page breaks can be previewed in the browser, but each browser will render the page
slightly differently. This means the page breaks cannot be guaranteed to be in the same
place in each browser. Hyphenation, bold, italic, font-sizes, font-family and sub and sup text
may result in subtle differences.

This is inspired by [paged.js][4].  That library is a full polyfill for [CSS paged media][5].
This library is a simpler sub-set of features, but allowing greater customisation of headers and footers.

## Instructions

Include the provided 'auto' script and the provided css on the page.

The page will be fragmented into printable pages.

Configuration is done via CSS.  You can either following the guidance below, or read the CSS and
go your own path.

If you want to process the page prior to fragmenting it, then see (`src/index.js`)[src/index.js];

### Layout

The fragmentation will create a page structure that looks like the following.

If there is a `<main>` element, the content will be taken from that element and all other content on the page removed.
Otherwise, all content on the page will used.  `<header>` and `<footer>` elements are removed to create headers and footers
(see below).

You may use CSS to modify the appearance of particular page, but avoid using `:last-child` or `nth-last-child` selectors on `.page`
as the fragmentation is calculated one page at a time, and the current page in the calculate will always match these selectors.

Avoid modifying `.page` or `.page-inner` without reading the notes in the CSS as you may break everything.

`data-page-last="true"` is added to the final page.  If adding this caused overflow, an additional page will be added.

```html
<body data-page-count="3" style="--var-page-count:3;">
  <div class="page" data-page-number="1" style="--var-page-number:1;">
    <div class="page-inner">
      <div class="page-header"></div> <!-- Optional -->
      <div class="page-content"></div>
      <div class="page-footer"></div> <!-- Optional -->
    </div>
  </div>
  <div class="page" data-page-number="2" style="--var-page-number:2;">
    <div class="page-inner">
      <div class="page-header"></div> <!-- Optional -->
      <div class="page-content"></div>
      <div class="page-footer"></div> <!-- Optional -->
    </div>
  </div>
  <div class="page" data-page-last="true" data-page-number="3" style="--var-page-number:3;">
    <div class="page-inner">
      <div class="page-header"></div> <!-- Optional -->
      <div class="page-content"></div>
      <div class="page-footer"></div> <!-- Optional -->
    </div>
  </div>
</div>
```

### Page size

Set `--page-size` on the body to set the page size.  The values should be valid values for the `@page` `size` property.

This will be the same for all pages.

```css
body {
  --page-size: A4 landscape; /* default */
}
```

### Page margins

Set `--page-margin` to set the margins.  The values should a valid margin size.

If you want to set the margins for a specific page then set the variable on a `.page`.

Note that Safari does not support `@page { margin }`.  So the margins will be larger when printing from Safari.

```css
/* All pages */
body {
  --page-margin: 1in; /* default */
}

/* First page */
.page:first-child {
  --page-margin: 5cm 2cm;
}

/* 4th page */
.page:nth-child(4) {
  --page-margin: 5cm 2cm;
}
```

### Headers and footers

You may set headers and footer by included `<header>` and `<footer>` elements that are direct children of `<body>`.

Use the data attribute `data-page-selector` on these elements to select which pages they should appear on.  This
should be a comma separated list of an+b selectors.  These are matched in document order, using the first matching. So
order them most specific to least specific.

```html
<header data-page-selector="1">
  Header content for first page
</header>

<header data-page-selector="last">
  "last" will place this on the last page where no fragmentation is required.
  If this results in fragmentation, an additional page will be generated as the
  last page that will (probably) have only a header and/or footer.
</header>

<header data-page-selector="even">
  Header content for even pages
</header>

<header>
  Header content for remaining pages
</header>
```

### Page numbers

CSS variables of `--page-count` is added to the body, and `--page-number` is added to each page.

Page numbers can be set using CSS counters. The class `.page-count` will do this for you, or see
the css file for how to customise.

```html
<footer>
  Other footer content
  <span class="page-count"></span>
</footer>
```

### Page breaks

Page break settings are read from computed CSS values.

**Do not**:

- place these inside `@page` as these cannot be read.
- set breaks rules using `!important` (see the CSS for why).

Supported properties:

- `break-before`: supports `auto`, `avoid` and `page`. Other values will be treated as `auto`.
- `break-after`: supports `auto`, `avoid` and `page`. Other values will be treated as `auto`.
- `break-inside`: supports `auto` and `avoid`. Other values will be treated as `auto`.
- `widows`: Firefox does not support widows, use `--widows` instead. Default is 2.
- `orphans`: Firefox does not support orphans, use `--orphans` instead. Default is 2.

If the content is broken across a table any `<thead>` will be cloned.

If your line-height is too small you may find pages will not break within text.

If your paragraphs have text hanging below the line you may find text breaking at
unexpected places.

## Fragmentation algorithm

This uses a limited implementation of the [CSS fragmentation module 3][6]

- fragmentation is processed in document order breaking on the first valid break point before an overflowing element
- no special consideration is given to tables, columns, float, grid or flexbox
- only page breaks are considered
- left, right, recto and verso breaks are no supported
- [class 3 break points][7] are not considered
- `box-decoration-break` is not supported. Elements are cloned when fragmented so all margins, borders and paddings are cloned
- margins, borders and padding are not [collapsed to prevent overflow][8]
- monolithic elements are not split to prevent overflow
- if no valid break-point is found the content will overflow off the page
- a new text line-box is determined to have started when `getClientRects` finds a DOMRect whose top is below the bottom of all previous
  DOMRects. This may fail to recognise new lines for closely packed text
- if is probably buggy

[1]: https://thecodingmachine.github.io/gotenberg/
[2]: https://github.com/puppeteer/puppeteer 
[3]: https://github.com/microsoft/playwright
[4]: https://www.pagedjs.org/
[5]: https://www.w3.org/TR/css-page-3/
[6]: https://www.w3.org/TR/css-break-3/
[7]: https://www.w3.org/TR/css-break-3/#end-block
[8]: https://www.w3.org/TR/css-break-3/#unforced-breaks
