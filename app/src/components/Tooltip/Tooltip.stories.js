import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Tooltip from './Tooltip';
import { buildTips } from './TipList';

storiesOf('Tooltip', module)
  .add('empty', () => {
    return <Tooltip />;
  })
  .add('formated', () => {
    const data = {
      name: 'fred',
      height: 68.12345,
    };

    const tipPatterns = [
      { label: 'Name', source: 'name' },
      { label: 'Height', source: 'height', format: '.2f' },
    ];

    const result = buildTips(data, tipPatterns);
    return result;
  });
