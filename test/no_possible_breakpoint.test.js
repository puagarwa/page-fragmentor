it('is three pages', async () => {
  await page.goto('http://localhost:1234/no_possible_breakpoint.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(3);
});
