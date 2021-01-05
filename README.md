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

Configuration is done via CSS.  You can either following the guidance below, or read the [CSS](styles/styles.css) and
go your own path.

If you want to process the page prior to fragmenting it, then see [`src/auto.js`](src/auto.js);

### Layout

The fragmentation will create a page structure that looks like the following.

If there is a `<main>` element, the content will be taken from that element and all other content on the page removed.
Otherwise, all content on the page will used.  `<header>` and `<footer>` elements are removed to create headers and footers
(see below).

You may use CSS to modify the appearance of particular page, but avoid using `:last-child` or `nth-last-child` selectors on `.page`
as the fragmentation is calculated one page at a time, and the current page in the calculation will always match these selectors.

Avoid modifying `.page` or `.page-inner` without reading the notes in the CSS as you may break everything.

`data-last-page="true"` is added to the final page.  If adding this caused overflow, an additional page will be added.

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
  <div class="page" data-last-page="true" data-page-number="3" style="--var-page-number:3;">
    <div class="page-inner">
      <div class="page-header"></div> <!-- Optional -->
      <div class="page-content"></div>
      <div class="page-footer"></div> <!-- Optional -->
    </div>
  </div>
</div>
```

### Page size

Set `--page-size` on the body to set the page size.  The values should be valid values for the [`@page size`][9] property.

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

You may set a header and footer by including a `<header>` and/or `<footer>` element that are direct children of `<body>`.
These will be cloned onto each page.

If you want to vary the headers and footers on each page, use CSS to show and hide content.  For example
`.page::not(nth-child(even)) .page-header .even-content { display: none}` will hide content on even pages.

The selector `.page[data-last-page="true"]` will select content on the last page.
This may result in an additional empty page with only headers or footers if this causes overflow.

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

Page break settings are read from computed CSS values using `window.getComputedStyle`.

**Do not**:

- place these inside `@page` as these cannot be read by by `window.getComputedStyle`.
- set breaks rules using `!important` as this may result in unexpected additional breaks when printing.

Supported properties:

- [`break-before`][10]: supports `auto`, `avoid` and `page`. Other values will be treated as `auto`.
- [`break-after`][11]: supports `auto`, `avoid` and `page`. Other values will be treated as `auto`.
- [`break-inside`][12]: supports `auto` and `avoid`. Other values will be treated as `auto`.
- [`widows`][13]: Firefox does not support widows, use `--widows` instead. Default is 2. The value must be >= 1
- [`orphans`][14]: Firefox does not support orphans, use `--orphans` instead. Default is 2. The value must be >= 1

### Tables

`<thead>` will be cloned if a page is broken across a table.

`<col>` elements will also be added to fix the width of the table.  This prevents overflow if fragmentation
causes the browser to resize the table cells.

The CSS contains some base settings for tables.

By default a `<tr>` has `break-inside: avoid`.  Without this breaks may happen within a table cell, which may
lead to cells changing columns.

Oversized table cells, theads or captions may lead to unpredictable results.

### Lists and counters

If an `<ol>` is fragmented the `start` property is set on the new fragment to preserve numbering.

If you use counters, be sure to check they still count across pages as expected.

### Events

Some events are provided if you wish to customise the fragmentation.  These events bubble.

- `create-page` - dispatched when a page is created, but before any fragmentation occurs
- `before-fragmentation` - dispatched before fragmentation.
   The `details` property contains the `Range` that will be moved into a new page
- `after-fragmentation` - dispatched after the range is extracted.
   The `details` property contains the extracted `DocumentFragment` that will be inserted into the next page
- `fragmentation-finished` - dispatched after the fragmentation process is completed.
   Dispatched on `document.body`.

## Fragmentation algorithm

The fragmentation algorithm is loosely based on the [CSS fragmentation module 3][6]

- breakpoints may occur between sibling nodes, or between text line-boxes
- the document is processed in document order.
  A forced breakpoint is immediately used.
  If an overflowing element is found the algorithm works backwards to find the first allowed breakpoint
- no special consideration is given to tables, columns, floats, grid or flexbox.
  Breakpoints may occur between columns, inside table cells or between flex/grid items that are laid out on a horizontal axis
- any CSS that changes the rendered order of elements from the logical DOM order - such a flex-order, grid, or floats -
  is not considered and may result in unexpected breakpoints
- only page breaks are considered
- left, right, recto and verso breaks are no supported
- [class 3 break points][7] are not considered
- `box-decoration-break` is not supported. Elements are cloned when fragmented and all margins, borders and paddings are cloned
- margins, borders and padding are not [collapsed to prevent overflow][8]
- monolithic elements are not split to prevent overflow
- if no valid break-point is found the content will overflow off the page.  By default this content is hidden
- There is no support for automated hyphenation.  If you enable `hypens` they will not be added across page breaks
- CSS inserted content cannot be fragmented
- it will have bugs.

## Development

```bash
npm install

# Start
npm start
# Visit http://localhost:1234

# Test
npm test

# Build
npm build
```

[1]: https://thecodingmachine.github.io/gotenberg/
[2]: https://github.com/puppeteer/puppeteer 
[3]: https://github.com/microsoft/playwright
[4]: https://www.pagedjs.org/
[5]: https://www.w3.org/TR/css-page-3/
[6]: https://www.w3.org/TR/css-break-3/
[7]: https://www.w3.org/TR/css-break-3/#end-block
[8]: https://www.w3.org/TR/css-break-3/#unforced-breaks
[9]: https://developer.mozilla.org/en-US/docs/Web/CSS/@page/size
[10]: https://developer.mozilla.org/en-US/docs/Web/CSS/break-before
[11]: https://developer.mozilla.org/en-US/docs/Web/CSS/break-after
[12]: https://developer.mozilla.org/en-US/docs/Web/CSS/break-inside
[13]: https://developer.mozilla.org/en-US/docs/Web/CSS/widows
[14]: https://developer.mozilla.org/en-US/docs/Web/CSS/orphans
