it('is two pages', async () => {
  await page.goto('http://localhost:1234/break_inside_avoid_blocks.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(2);
});

it('does not break between the div blocks', async () => {
  await page.goto('http://localhost:1234/break_inside_avoid_blocks.html', { waitUntil: 'load' });
  expect(await page.$$('.page:nth-child(1) .block')).toHaveLength(0);
  expect(await page.$$('.page:nth-child(2) .block')).toHaveLength(3);
});
