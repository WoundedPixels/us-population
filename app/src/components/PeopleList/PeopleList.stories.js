import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import PeopleList from './PeopleList';

storiesOf('PeopleList', module)
  .add('empty', () => {
    const people = [];
    return <PeopleList people={people} />;
  })
  .add('some people', () => {
    const people = [
      { name: 'fred', height: 72 },
      { name: 'wilma', height: 68 },
      { name: 'barney', height: 44 },
    ];
    return <PeopleList people={people} />;
  });
