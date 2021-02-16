it('has the expected number of pages', async () => {
  await page.goto('http://localhost:1234/letter_template_with_tables.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(6);
});
