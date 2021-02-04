it('is two pages', async () => {
  await page.goto('http://10.244.1.5:1234/break_before_page.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(2);
});
