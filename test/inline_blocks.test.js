it('is four pages', async () => {
  await page.goto('http://localhost:1234/inline_blocks.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(4);
});

it('breaks the first page after 10 boxes', async () => {
  await page.goto('http://localhost:1234/inline_blocks.html', { waitUntil: 'load' });
  expect(await page.$$('.page:nth-child(1) span')).toHaveLength(10);
});

it('breaks the third page after 10 boxes', async () => {
  await page.goto('http://localhost:1234/inline_blocks.html', { waitUntil: 'load' });
  expect(await page.$$('.page:nth-child(3) span')).toHaveLength(10);
});
