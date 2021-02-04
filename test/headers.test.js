test.jestPlaywrightConfig(
  {
    browsers: ['webkit'],
  },
  'headers', async () => {
  await page.goto('http://10.244.1.5:1234/headers.html', { waitUntil: 'load' });

  // Safari handles white space differently
  expect(await page.$$eval('.page .page-header', (nodes) => nodes.map((node) => node.innerText.trim().replace(/\s+/g, ' ')))).toEqual([
    'First Odd Page',
    'Even Page',
    'Odd Page',
    'Even Page',
    'Odd Page',
    'Even Last Page',
  ]);
});
