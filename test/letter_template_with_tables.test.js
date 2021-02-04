it('has the expected number of pages', async () => {
  await page.goto('http://10.244.1.5:1234/letter_template_with_tables.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(6);
});
