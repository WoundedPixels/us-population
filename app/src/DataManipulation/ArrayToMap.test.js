import { arrayToMap } from './ArrayToMap';

const empty = [];

const raw = [
  { id: 1, name: 'fred' },
  { id: 2, name: 'wilma' },
  { id: 3, name: 'barney' },
  { id: 4, name: 'betty' },
];

const withBadKey = [
  { id: 1, name: 'fred' },
  { id: 2, nokeyhere: 'wilma' },
  { id: 3, name: 'barney' },
  { id: 4, name: 'betty' },
];

it('tolerates an empty array to an empty map', () => {
  const result = arrayToMap(empty, 'id');
  expect(result).toEqual({});
});

it('converts an array to a map with numeric keys', () => {
  const result = arrayToMap(raw, 'id');
  expect(result[2]).toEqual({ id: 2, name: 'wilma' });
});

it('converts an array to a map with string keys', () => {
  const result = arrayToMap(raw, 'name');
  expect(result.wilma).toEqual({ id: 2, name: 'wilma' });
});

it('throws up when there is a missing key', () => {
  expect(() => {
    arrayToMap(withBadKey, 'name');
  }).toThrow();
});
