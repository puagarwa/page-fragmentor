it('is two pages', async () => {
  await page.goto('http://localhost:1234/break_before_page.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(2);
});
