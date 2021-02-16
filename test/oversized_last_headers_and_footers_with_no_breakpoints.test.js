it('is one page', async () => {
  await page.goto('http://localhost:1234/oversized_last_headers_and_footers_with_no_breakpoints.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(1);
});

it('has headers and footers', async () => {
  await page.goto('http://localhost:1234/oversized_last_headers_and_footers_with_no_breakpoints.html', { waitUntil: 'load' });

  expect(await page.$eval('.page', (node) => node.innerText)).toContain('Header');
  expect(await page.$eval('.page', (node) => node.innerText)).toContain('Footer');
});
