it('has the expected number of pages', async () => {
  await page.goto('http://localhost:1234/the_machine_stops.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(40);
  const lastPageText = await page.$eval('.page:last-child', (element) => element.innerText);
  expect(lastPageText).toContain('Copyright ©1947 E.M. Forster');
});

it('sets the total pages', async () => {
  await page.goto('http://localhost:1234/the_machine_stops.html', { waitUntil: 'load' });

  expect(await page.$eval('body', (el) => el.dataset.pageCount)).toEqual('40');
  expect(await page.$eval('body', (el) => el.style.getPropertyValue('--page-count'))).toEqual('40');
});

it('sets the page numbers', async () => {
  await page.goto('http://localhost:1234/the_machine_stops.html', { waitUntil: 'load' });
  const pageNumbers = Array(41).fill().map((_, i) => String(i)).slice(1);

  expect(await page.$$eval('.page', (els) => els.map((el) => el.dataset.pageNumber))).toEqual(pageNumbers);
  expect(await page.$$eval('.page', (els) => els.map((el) => el.style.getPropertyValue('--page-number')))).toEqual(pageNumbers);
});
