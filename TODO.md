# TODO

- Fix - No fragmentation between td

- Test pages
  - avoid - make sure breaks are between siblings
  - margin bottom for sibling breaks

- widows / orphans for an empty BR
- loading indicator
- Tidy files
  - move generators
  - sax generator name
- https://github.com/w3c/selection-api/issues/37
- https://stackoverflow.com/questions/783899/how-can-i-count-text-lines-inside-an-dom-element-can-i

<div>
  <div>
    <div>
    </div>
  </div>
  x
  <div>
    x
    <div></div>
  </div>
  x
  [text]
</div>
x
<div>
  <div></div>
</div>
<div>
  <div></div>
</div>
