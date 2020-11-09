describe('the machine stops', () => {
  it('matches snapshot', async () => {
    await page.goto('http://localhost:1234/pages/the_machine_stops.html', { waitUntil: 'load' });
    const body = await page.evaluate(() => document.body.innerHTML);
    expect(body).toMatchSnapshot();
  });
});
