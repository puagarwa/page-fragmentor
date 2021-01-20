it('has the expected number of pages', async () => {
  await page.goto('http://localhost:1234/table_no_thead.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(14);
  expect(await page.$eval('.page:last-child', (page) => page.innerText)).toContain('nine-hundred-ninety-nine');
});
