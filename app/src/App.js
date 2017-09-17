// @flow

import React, { Component } from 'react';
import * as d3 from 'd3';
import { interpolateBlues } from 'd3-scale-chromatic';

import ZoomableGroup from './components/ZoomableGroup/ZoomableGroup';
import Map from './components/Map/Map';
import Tooltip from './components/Tooltip/Tooltip';
import { topoToGeo, enrich } from './DataManipulation';

import './App.css';

const calculateFill = d => {
  const colorScale = d3.scaleSequential(interpolateBlues);
  return colorScale(d.properties.populationRatio);
};

const emptyFill = () => {
  return 'none';
};

const buildTooltip = d => {
  return `d.properties: ${JSON.stringify(d.properties)}`;
};

class App extends Component {
  state: {
    countiesGeoJSON: Object,
    statesGeoJSON: Object,
  };

  constructor(props: Object) {
    super(props);

    this.state = {
      countiesGeoJSON: Object,
      statesGeoJSON: Object,
    };
  }

  componentDidMount() {
    d3
      .queue()
      .defer(d3.json, '/topo-json/us-10m.json')
      .defer(d3.csv, '/data/StatesFIPSCodes.csv')
      .defer(d3.csv, '/data/ACS_15_SPT_B01003.csv')
      .await((error, topoJSON, stateFipsCodes, populationByCounty) => {
        const statesGeoJSON = topoToGeo(topoJSON, 'states');
        const countiesGeoJSON = topoToGeo(topoJSON, 'counties');

        const populationByState = populationByCounty.reduce(
          (popMap, county) => {
            const stateFIPS = county['GEO.id2'].substring(0, 2);
            popMap[stateFIPS] = popMap[stateFIPS] || 0;
            popMap[stateFIPS] += +county['HD01_VD01'];
            return popMap;
          },
          {},
        );

        statesGeoJSON.forEach(feature => {
          feature.properties.population = populationByState[feature.id];
        });

        const maxStatePopulation = d3.max(statesGeoJSON, feature => {
          return feature.properties.population;
        });

        statesGeoJSON.forEach(feature => {
          feature.properties.populationRatio =
            feature.properties.population / maxStatePopulation;
        });

        enrich(statesGeoJSON, stateFipsCodes, 'STATE_FIPS', {
          STATE_NAME: 'name',
          STATE_FIPS: 'fipsCode',
          STUSAB: 'abbreviation',
        });

        enrich(countiesGeoJSON, populationByCounty, 'GEO.id2', {
          'GEO.display-label': 'name',
          'GEO.id2': 'fipsCode',
          HD01_VD01: 'population',
        });

        this.setState({ statesGeoJSON });
        this.setState({ countiesGeoJSON });
      });
  }

  render() {
    const width = 950;
    const height = 0.65 * width;

    return (
      <div id="App">
        <Tooltip />
        <ZoomableGroup width={width} height={height}>
          <Map
            regionsGeoJSON={this.state.statesGeoJSON}
            buildTooltip={buildTooltip}
            calculateFill={calculateFill}
            minScale="0"
            maxScale="1000000"
          />
          <Map
            regionsGeoJSON={this.state.countiesGeoJSON}
            buildTooltip={buildTooltip}
            calculateFill={emptyFill}
            minScale="2"
            maxScale="1000000"
          />
        </ZoomableGroup>
      </div>
    );
  }
}

export default App;
