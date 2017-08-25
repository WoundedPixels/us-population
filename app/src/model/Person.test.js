import Person from './Person';

it('construct a person', () => {
  const p = new Person('Fred', 18);
  expect(p.name).toBe('Fred');
  expect(p.height).toBe(18);
});
