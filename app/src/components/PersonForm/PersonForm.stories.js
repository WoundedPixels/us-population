import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import PersonForm from './PersonForm';

storiesOf('PersonForm', module).add('empty', () =>
  <PersonForm onAdd={action('add person')} />,
);
