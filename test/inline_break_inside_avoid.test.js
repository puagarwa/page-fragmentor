it('is four pages', async () => {
  await page.goto('http://localhost:1234/inline_break_inside_avoid.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(2);
});

it('breaks within the inline block', async () => {
  await page.goto('http://localhost:1234/inline_break_inside_avoid.html', { waitUntil: 'load' });
  expect(await page.$eval('.page:nth-child(1) b', (node) => node.innerText)).toEqual('Break within');
  expect(await page.$eval('.page:nth-child(2) b', (node) => node.innerText)).toEqual('me is fine');
});
