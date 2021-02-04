it('is five pages', async () => {
  await page.goto('http://10.244.1.5:1234/break_word.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(5);
});
