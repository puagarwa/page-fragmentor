# @citizensadvice/paged

Split a HTML page into printable pages.

This is inspired by [paged.js][1].
That library is more sophisticated than our needs.  This library is simpler and more flexible.

## Instructions

Include the paged script.

The page will be chunked into printable pages.

### Headers and footers

You may set headers and footer by included `<header>` and `<footer>` elements that are children of `<body>`.

### Settings

A settings object can be supplied as either a global called `pagedConfig` or a JSON object inside a `<meta>` tag with the name `paged-config`.

This is an array 

```
<!doctype html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <title>Example setup</title>
  <meta name="paged-rules" contents='
    [
      { "selector": "h2", "breakBefore": "page" },
      { "selector": "thead,caption", "breakInside": "avoid", breakAfter: "avoid" },
      { "selector": "tr", "breakInside": "avoid" },
      { "selector": "body", "widows": 3, "orphans": 3 }
    ]
  '>
  <script src="paged.js"></script>
  <link rel="stylesheet" href="pages.css">
</head>
<body>
  <header data-paged-page="1">
    A header to be included on page 1
  </header>
  <header>
    A header to be included on all other pages
  </header>
  <main>
    The contents to be paged
  </main>
  <footer>
    A footer on all pages
    Page <span data-paged-page-number></span> of <span data-paged-page-count></span>
  </footer>
</body>
</html>
```

[1]: https://www.pagedjs.org/
