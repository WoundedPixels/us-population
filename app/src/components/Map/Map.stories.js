import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { topoToGeo } from '../../DataManipulation';

import Map from './Map';
import Tooltip from '../Tooltip/Tooltip';

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
          statesGeoJSON={statesGeoJSON}
          countiesGeoJSON={countiesGeoJSON}
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
          statesGeoJSON={statesGeoJSON}
          countiesGeoJSON={countiesGeoJSON}
        />
        <Map
          width="400"
          statesGeoJSON={statesGeoJSON}
          countiesGeoJSON={countiesGeoJSON}
        />
      </div>
    );
  });
