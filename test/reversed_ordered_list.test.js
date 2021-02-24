it('has the expected number of pages', async () => {
  await page.goto('http://localhost:1234/reversed_ordered_list.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(5);
});

it('sets the list start', async () => {
  await page.goto('http://localhost:1234/reversed_ordered_list.html', { waitUntil: 'load' });
  expect(await page.$$eval('.page ol', (els) => els.map((el) => el.start))).toEqual([154, 117, 81, 44, 6]);
});
