it('is seven pages', async () => {
  await page.goto('http://localhost:1234/breaks_between_siblings.html', { waitUntil: 'load' });
  expect(await page.$$('.page')).toHaveLength(7);
});

it('has the correct text on each page', async () => {
  await page.goto('http://localhost:1234/breaks_between_siblings.html', { waitUntil: 'load' });
  expect(await page.$$eval('.page', (nodes) => nodes.map((node) => node.innerText.trim()))).toEqual([
    'Each line of text should be on a separate page with no blank pages',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Nam cursus pulvinar magna, in viverra nisi.',
    'Ut id elit eget enim elementum pellentesque.',
    'Vestibulum mi neque, tristique at eleifend at, mollis interdum felis.',
    'Vestibulum mi neque, tristique at eleifend at, mollis interdum felis.',
    'Aenean sit amet elementum erat. Etiam malesuada quam a mi rutrum, a malesuada tellus ultricies.',
  ]);
});
