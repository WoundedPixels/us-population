import React from 'react';
import ReactDOM from 'react-dom';
import PeopleList from './PeopleList';

it('renders empty without crashing', () => {
  const div = document.createElement('div');
  const people = [];
  ReactDOM.render(<PeopleList people={people} />, div);
});

it('renders list without crashing', () => {
  const div = document.createElement('div');
  const people = [
    { name: 'fred', height: 72 },
    { name: 'wilma', height: 68 },
    { name: 'barney', height: 44 },
  ];
  ReactDOM.render(<PeopleList people={people} />, div);
});
