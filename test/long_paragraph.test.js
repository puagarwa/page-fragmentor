import sanitizeFilename from 'sanitize-filename';

describe('the machine stops', () => {
  afterEach(async () => {
    await page.pdf({
      path: `test/screenshots/${sanitizeFilename(expect.getState().currentTestName)} ${browserName}.pdf`,
      format: 'A4',
    });
    await page.screenshot({
      path: `test/screenshots/${sanitizeFilename(expect.getState().currentTestName)} ${browserName}.png`,
      fullPage: true,
    });
  });

  it('matches snapshot', async () => {
    await page.goto('http://localhost:1234/pages/long_paragraph.html', { waitUntil: 'load' });
    const body = await page.evaluate(() => document.body.innerHTML);
    expect(body).toMatchSnapshot(browserName);
  });
});
