import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { topoToGeo } from '../../DataManipulation';

import Map from './Map';
import Tooltip from '../Tooltip/Tooltip';

const buildTooltip = d => {
  return 'Static tooltip';
};

const calculateFill = d => {
  return 'blue';
};

const topoJSON = require('../../../public/topo-json/us-10m.json');
const statesGeoJSON = topoToGeo(topoJSON, 'states');
const countiesGeoJSON = topoToGeo(topoJSON, 'counties');

storiesOf('Map', module)
  .add('empty', () => {
    return <Map width="950" />;
  })
  .add('populated', () => {
    return (
      <div>
        <Tooltip />
        <Map
          width="900"
          regionsGeoJSON={statesGeoJSON}
          buildTooltip={buildTooltip}
          calculateFill={calculateFill}
        />
      </div>
    );
  })
  .add('big and small', () => {
    return (
      <div>
        <Tooltip />
        <Map
          width="800"
          regionsGeoJSON={countiesGeoJSON}
          buildTooltip={buildTooltip}
          calculateFill={calculateFill}
        />
        <Map
          width="400"
          regionsGeoJSON={statesGeoJSON}
          buildTooltip={buildTooltip}
          calculateFill={calculateFill}
        />
      </div>
    );
  });
