it('has the expected number of pages', async () => {
  await page.goto('http://localhost:1234/widows.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(3);
});

// it('breaks the second paragraph onto a new page', async () => {
//   await page.goto('http://localhost:1234/widows.html', { waitUntil: 'load' });
//   expect(await page.$eval('.page:nth-child(2) p', (node) => node.innerText)).toMatch(/^ante magna pellentesque lectus/);
// });
