it('is four pages', async () => {
  await page.goto('http://localhost:1234/text_with_line_breaks.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(2);
});

it('breaks the second page before a br', async () => {
  await page.goto('http://localhost:1234/text_with_line_breaks.html', { waitUntil: 'load' });
  expect(await page.$eval('.page:nth-child(2) .page-content p', (node) => node.innerHTML)).toMatch(/^<br>\s+Vestibulum quis lacus/);
});
