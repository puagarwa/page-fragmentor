it('is two pages', async () => {
  await page.goto('http://10.244.1.5:1234/oversized_last_headers_and_footers.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(2);
});

it('has no content on last page', async () => {
  await page.goto('http://10.244.1.5:1234/oversized_last_headers_and_footers.html', { waitUntil: 'load' });

  expect(await page.$eval('.page:last-child .page-content', (node) => node.innerText)).toEqual('');
});

it('has headers and footers only on last page', async () => {
  await page.goto('http://10.244.1.5:1234/oversized_last_headers_and_footers.html', { waitUntil: 'load' });

  expect(await page.$eval('.page:first-child', (node) => node.innerText)).not.toContain('Header');
  expect(await page.$eval('.page:nth-child(2)', (node) => node.innerText)).toContain('Header');

  expect(await page.$eval('.page:first-child', (node) => node.innerText)).not.toContain('Footer');
  expect(await page.$eval('.page:nth-child(2)', (node) => node.innerText)).toContain('Footer');
});
