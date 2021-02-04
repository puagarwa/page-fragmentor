test.jestPlaywrightConfig(
  {
    browsers: ['webkit'],
  },
  'footers', async () => {
  await page.goto('http://10.244.1.5:1234/footers.html', { waitUntil: 'load' });

  // Safari handles white space differently
  expect(await page.$$eval('.page .page-footer', (nodes) => nodes.map((node) => node.innerText.trim().replace(/\s+/g, ' ')))).toEqual([
    'First Odd Page',
    'Even Page',
    'Odd Page',
    'Even Page',
    'Odd Page',
    'Even Last Page',
  ]);
});
