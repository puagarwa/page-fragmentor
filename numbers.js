const converter = require('number-to-words');

const inlines = [null, 'sub', 'sup', 'strong', 'b', 'i', 'u', 'kbd', 'em'];

let cells = 0;
for (let i = 0; i < 1000; ++i) {
  if (cells % 4 === 0) {
    console.log(`</tr>\n<tr>`);
  }
  const count = Math.floor(Math.random() * 4);
  const words = [];
  for (let j = 0; j < count; ++j) {
    const word = converter.toWords(i).replace(/[\s,]+/g, '-');
    words.push(word);
    ++i;
  }
  --i;
  console.log(`<td>${words.join('<br>')}</td>`);
  ++cells;
}
