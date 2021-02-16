it.jestPlaywrightSkip(
  {
    browsers: ['webkit'],
  },
  'is three pages', async () => {
    await page.goto('http://localhost:1234/text_with_image.html', { waitUntil: 'load' });
    expect(await page.$$('.page')).toHaveLength(3);
  });
