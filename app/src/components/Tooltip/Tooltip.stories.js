import React from 'react';

import { storiesOf } from '@storybook/react';

import Tooltip from './Tooltip';

storiesOf('Tooltip', module).add('empty', () => {
  return <Tooltip />;
});
