it('has the expected number of pages', async () => {
  await page.goto('http://localhost:1234/ordered_list.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(5);
});

// it('sets the list start', async () => {
//   await page.goto('http://localhost:1234/ordered_list.html', { waitUntil: 'load' });
//   expect(await page.$$eval('.page ol', (els) => els.map((el) => el.start))).toEqual([1, 38, 74, 111, 149]);
// });
