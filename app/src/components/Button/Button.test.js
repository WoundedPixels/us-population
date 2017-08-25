import React from 'react';
import renderer from 'react-test-renderer';
import Button from './Button';

const fpp = '';

it('no callback matches snapshot', () => {
  const tree = renderer.create(<Button>Hi</Button>).toJSON();
  expect(tree).toMatchSnapshot();

  const someOtherJSON = { flavor: 'fudge' };
  expect(someOtherJSON).toMatchSnapshot();
});

it('with callback matches snapshot', () => {
  const cb = () => {};
  const tree = renderer.create(<Button onClick={cb}>Hi</Button>).toJSON();
  expect(tree).toMatchSnapshot();
});

it('arbitrary json matches snapshot', () => {
  const someOtherJSON = { flavor: 'fudge' };
  expect(someOtherJSON).toMatchSnapshot();
});
