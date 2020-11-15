const converter = require('number-to-words');

const inlines = [null, 'sub', 'sup', 'strong', 'b', 'i', 'u', 'kbd', 'em'];

for (let i = 0; i < 1000; ++i) {
  const word = converter.toWords(i).replace(/[\s,]+/g, '-');
  const wrapper = inlines[Math.round(Math.random() * inlines.length)];
  if (!wrapper) {
    console.log(word);
  } else {
    console.log(`<${wrapper}>${word}</${wrapper}>`);
  }
}
