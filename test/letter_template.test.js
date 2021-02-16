it('has the expected number of pages', async () => {
  await page.goto('http://localhost:1234/letter_template.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(2);
});

it('breaks in the expected place', async () => {
  await page.goto('http://localhost:1234/letter_template.html', { waitUntil: 'load' });
  expect(await page.$eval('.page:nth-child(2)', (node) => node.innerText.trim().replace(/\s+/g, ' '))).toEqual(
    'Yours sincerely Ade Visor @copyright 2020 Citizens Advice',
  );
});
