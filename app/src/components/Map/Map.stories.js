import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { topoToGeo } from '../../DataManipulation';

import Map from './Map';
import Tooltip from '../Tooltip/Tooltip';

const buildTooltip = d => <div>Static tooltip</div>;
const calculateFill = d => 'blue';
const calculateStroke = d => 'black';

const calculateStrokeWidth = d => {
  return Math.random() * 3;
};

const topoJSON = require('../../../public/topo-json/us-10m.json');
const statesGeoJSON = topoToGeo(topoJSON, 'states');
const countiesGeoJSON = topoToGeo(topoJSON, 'counties');

storiesOf('Map', module)
  .addDecorator(story =>
    <div>
      <Tooltip />
      <svg width="950" height="500">
        {story()}
      </svg>
    </div>,
  )
  .add('empty', () => {
    return <Map width="950" />;
  })
  .add('no optional parameters', () => {
    return (
      <Map
        regionsGeoJSON={statesGeoJSON}
        buildTooltip={buildTooltip}
        scale="1"
      />
    );
  })
  .add('all optional parameters', () => {
    return (
      <Map
        regionsGeoJSON={statesGeoJSON}
        buildTooltip={buildTooltip}
        calculateFill={calculateFill}
        calculateStroke={calculateStroke}
        calculateStrokeWidth={calculateStrokeWidth}
        scale="1"
      />
    );
  });
