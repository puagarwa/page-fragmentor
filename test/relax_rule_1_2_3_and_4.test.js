it('is two pages', async () => {
  await page.goto('http://localhost:1234/relax_rule_1_2_3_and_4.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(2);
});
