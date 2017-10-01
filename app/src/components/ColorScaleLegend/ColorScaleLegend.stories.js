import React from 'react';

import { storiesOf } from '@storybook/react';

import * as d3 from 'd3';
import { interpolateYlOrRd } from 'd3-scale-chromatic';

import ColorScaleLegend from './ColorScaleLegend';

storiesOf('ColorScaleLegend', module).add('simple scale', () => {
  const props = {
    blockHeight: 50,
    blockWidth: 50,
    colorScale: d3.scaleSequential(interpolateYlOrRd).domain([0.0, 1.0]),
    format: '.0%',
    values: [0, 0.2, 0.4, 0.6, 0.8, 1],
  };

  return <ColorScaleLegend {...props} />;
});
