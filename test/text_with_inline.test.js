it('is four pages', async () => {
  await page.goto('http://10.244.1.5:1234/text_with_inline.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(4);
});

it('breaks the second page with the text', async () => {
  await page.goto('http://10.244.1.5:1234/text_with_inline.html', { waitUntil: 'load' });
  expect(await page.$eval('.page:nth-child(2)', (node) => node.innerText)).toContain('malesuada tellus ultricies');
});

it('breaks the fourth page before the span', async () => {
  await page.goto('http://10.244.1.5:1234/text_with_inline.html', { waitUntil: 'load' });
  expect(await page.$('.page:nth-child(3) p > span')).toBeFalsy();
  expect(await page.$('.page:nth-child(4) p > span')).toBeTruthy();
});
