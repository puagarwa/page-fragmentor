it('is four pages', async () => {
  await page.goto('http://10.244.1.5:1234/text_margin_border_and_padding.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(4);
});
