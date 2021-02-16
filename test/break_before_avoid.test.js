it('is two pages', async () => {
  await page.goto('http://localhost:1234/break_before_avoid.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(2);
});

// it('breaks within the text block', async () => {
//   await page.goto('http://localhost:1234/break_before_avoid.html', { waitUntil: 'load' });
//   expect(await page.$eval('.page:nth-child(2) p', (node) => node.innerText)).toMatch(/^Vestibulum quis lacus nec purus gravida placerat eu ac urna/);
// });
