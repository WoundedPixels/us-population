import React from 'react';

import { storiesOf } from '@storybook/react';

import { topoToGeo } from '../../DataManipulation';

import CentroidCircleMap from './CentroidCircleMap';
import Tooltip from '../Tooltip/Tooltip';

const buildTooltip = d => {
  return 'Static tooltip';
};

const calculateArea = d => {
  return Math.random() * 400;
};

const calculateFill = d => {
  return 'yellow';
};

const calculateStroke = d => {
  return 'black';
};

const calculateStrokeWidth = d => {
  return Math.random() * 2;
};

const topoJSON = require('../../../public/topo-json/us-10m.json');
const statesGeoJSON = topoToGeo(topoJSON, 'states');
const countiesGeoJSON = topoToGeo(topoJSON, 'counties');

storiesOf('CentroidCircleMap', module)
  .addDecorator(story =>
    <div>
      <Tooltip />
      <svg width="950" height="500">
        {story()}
      </svg>
    </div>,
  )
  .add('empty', () => {
    return <CentroidCircleMap width="950" />;
  })
  .add('no optional parameters', () => {
    return (
      <CentroidCircleMap
        regionsGeoJSON={statesGeoJSON}
        buildTooltip={buildTooltip}
        calculateArea={calculateArea}
        minScale="0"
        maxScale="1000000"
        scale="1"
      />
    );
  })
  .add('all optional parameters', () => {
    return (
      <CentroidCircleMap
        regionsGeoJSON={statesGeoJSON}
        buildTooltip={buildTooltip}
        calculateArea={calculateArea}
        calculateFill={calculateFill}
        calculateStroke={calculateStroke}
        calculateStrokeWidth={calculateStrokeWidth}
        minScale="0"
        maxScale="1000000"
        scale="1"
      />
    );
  });
