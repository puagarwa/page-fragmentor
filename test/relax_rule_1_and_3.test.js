it('is two pages', async () => {
  await page.goto('http://localhost:1234/relax_rule_1_and_3.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(2);
});

it('does not break within the text block', async () => {
  await page.goto('http://localhost:1234/relax_rule_1_and_3.html', { waitUntil: 'load' });
  expect(await page.$eval('.page:nth-child(2) p', (node) => node.innerText)).toMatch(/^Lorem ipsum/);
});
