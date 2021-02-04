it('has the expected number of pages', async () => {
  await page.goto('http://10.244.1.5:1234/table_with_caption.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(2);
});

it('breaks the table onto the second page', async () => {
  await page.goto('http://10.244.1.5:1234/table_with_caption.html', { waitUntil: 'load' });
  expect(await page.$('.page:first-child caption')).toBeFalsy();
  expect(await page.$('.page:last-child caption')).toBeTruthy();
});
