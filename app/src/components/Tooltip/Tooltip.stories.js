import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Tooltip from './Tooltip';

storiesOf('Tooltip', module).add('empty', () => {
  return <Tooltip />;
});
