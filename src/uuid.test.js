import { uuid } from './uuid';

it('generates a uuidv4', () => {
  expect(uuid()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
});

it('generates unique uuids', () => {
  expect(uuid()).not.toEqual(uuid());
});
