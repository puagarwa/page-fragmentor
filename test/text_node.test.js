it('is three pages', async () => {
  await page.goto('http://10.244.1.5:1234/text_node.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(3);
});
