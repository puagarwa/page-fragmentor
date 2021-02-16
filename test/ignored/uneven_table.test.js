it('has the expected number of pages', async () => {
  await page.goto('http://localhost:1234/uneven_table.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(24);
  expect(await page.$eval('.page:last-child', (page) => page.innerText)).toContain('nine-hundred-ninety-nine');
});

it('copies thead', async () => {
  await page.goto('http://localhost:1234/uneven_table.html', { waitUntil: 'load' });
  expect(await page.$$('.page table > thead')).toHaveLength(24);
});
