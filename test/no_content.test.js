it('is one page with no content', async () => {
  await page.goto('http://localhost:1234/no_content.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(1);
  expect(await page.$eval('.page', (el) => el.innerText.trim())).toEqual('');
  expect(await page.$eval('.page', (el) => el.dataset.pageNumber)).toEqual('1');
  expect(await page.$eval('.page', (el) => el.style.getPropertyValue('--page-number'))).toEqual('1');
  expect(await page.$eval('body', (el) => el.dataset.pageCount)).toEqual('1');
  expect(await page.$eval('body', (el) => el.style.getPropertyValue('--page-count'))).toEqual('1');
});
