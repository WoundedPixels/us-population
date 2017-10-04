import React from 'react';

import { storiesOf } from '@storybook/react';

import Tips from './Tips';
import Tip from './Tip';

storiesOf('Tips', module).add('contents', () => {
  return (
    <Tips>
      <Tip label="Person" />
      <Tip label="Name:" value="Fred" />
    </Tips>
  );
});
