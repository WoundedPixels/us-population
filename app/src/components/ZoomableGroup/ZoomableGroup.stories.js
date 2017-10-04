import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { topoToGeo } from '../../DataManipulation';

import ZoomableGroup from './ZoomableGroup';
import Map from '../Map/Map';
import Tooltip from '../Tooltip/Tooltip';

const buildTooltip = d => {
  return <div>Static tooltip</div>;
};

const calculateFill = d => {
  return 'blue';
};

const topoJSON = require('../../../public/topo-json/us-10m.json');
const statesGeoJSON = topoToGeo(topoJSON, 'states');
const countiesGeoJSON = topoToGeo(topoJSON, 'counties');

storiesOf('ZoomableGroup', module)
  .add('with no children', () => <ZoomableGroup />)
  .add('different children', () =>
    <div>
      <Tooltip />
      <ZoomableGroup width="1000" height="500">
        <Map
          regionsGeoJSON={statesGeoJSON}
          buildTooltip={buildTooltip}
          calculateFill={calculateFill}
          minScale="0"
          maxScale="3"
        />
        <Map
          regionsGeoJSON={countiesGeoJSON}
          buildTooltip={buildTooltip}
          calculateFill={calculateFill}
          minScale="3"
          maxScale="5"
        />
      </ZoomableGroup>
    </div>,
  );
