it('is two pages', async () => {
  await page.goto('http://10.244.1.5:1234/relax_rule_1_2_3_and_4.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(2);
});
