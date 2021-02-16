it('is three pages', async () => {
  await page.goto('http://localhost:1234/break_after_page.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(3);
});
