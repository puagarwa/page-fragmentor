it('creates all pages', async () => {
  await page.goto('http://10.244.1.5:1234/long_paragraph.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(8);
  expect(await page.$eval('.page:last-child', (page) => page.innerText)).toContain('nine-hundred-ninety-nine');
});
