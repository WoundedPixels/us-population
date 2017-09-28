// @flow

import React, { Component } from 'react';
import * as d3 from 'd3';
import { interpolateYlOrRd } from 'd3-scale-chromatic';

import ZoomableGroup from './components/ZoomableGroup/ZoomableGroup';
import CentroidCircleMap from './components/CentroidCircleMap/CentroidCircleMap';
import Map from './components/Map/Map';
import Tooltip from './components/Tooltip/Tooltip';

import { topoToGeo, enrich } from './DataManipulation';

import './App.css';

const BASE_PATH =
  'https://raw.githubusercontent.com/WoundedPixels/us-population/gh-pages/';

const calculateArea = d => {
  if (!d.properties || !d.properties.allAgesCount) {
    console.log('no population', JSON.stringify(d));
  }

  const count = d.properties.allAgesCount || 0;
  return count / 2500;
};

const calculateFill = d => {
  const colorScale = d3.scaleSequential(interpolateYlOrRd).domain([0.0, 0.62]);
  return colorScale(d.properties.childrenPovertyRatio);
};

const neutralFill = d => {
  return d.properties.childrenPovertyRatio < 0.4 ? '#EEEEEE' : '#FFFFFF';
};

const buildTooltip = d => {
  const {
    allAgesCount,
    childrenPovertyRatio,
    name,
    stateAbbreviation,
  } = d.properties;
  const cpr = d3.format('.1%')(childrenPovertyRatio);
  const count = d3.format(',')(allAgesCount);
  const fullname = name.includes('County')
    ? `${name}, ${stateAbbreviation}`
    : name;

  return (
    <div className="tips">
      <div className="label">
        {fullname}
      </div>
      <div className="tip">
        <span className="label">Childhood Poverty Rate: </span>
        <span>
          {cpr}
        </span>
      </div>
      <div className="tip">
        <span className="label">Population: </span>
        <span>
          {count}
        </span>
      </div>
    </div>
  );
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
      .defer(d3.json, BASE_PATH + 'topo-json/us-10m.json')
      .defer(d3.csv, BASE_PATH + 'data/est15-subset.csv')
      .await((error, topoJSON, rawPovertyData) => {
        const povertyData = rawPovertyData.map(row => {
          return {
            stateFIPS: d3.format('02')(row.stateFIPS),
            countyFIPS: d3.format('03')(row.countyFIPS),
            fipsCode:
              d3.format('02')(row.stateFIPS) + d3.format('03')(row.countyFIPS),
            name: row.name,
            stateAbbreviation: row.stateAbbreviation,
            medianHouseholdIncome: row.medianHouseholdIncome,
            allAgesPovertyCount: +row.allAgesPovertyCount,
            allAgesPovertyRatio: +row.allAgesPovertyPercent / 100,
            allAgesCount: Math.trunc(
              100 * row.allAgesPovertyCount / row.allAgesPovertyPercent,
            ),
            childrenPovertyCount: +row.childrenPovertyCount,
            childrenPovertyRatio: +row.childrenPovertyPercent / 100,
            childrenCount: Math.trunc(
              100 * row.childrenPovertyCount / row.childrenPovertyPercent,
            ),
          };
        });

        const states = povertyData.filter(row => row.countyFIPS === '000');
        const counties = povertyData.filter(row => row.countyFIPS !== '000');

        const statesGeoJSON = topoToGeo(topoJSON, 'states');
        const countiesGeoJSON = topoToGeo(topoJSON, 'counties');

        enrich(statesGeoJSON, states, 'stateFIPS');
        enrich(countiesGeoJSON, counties, 'fipsCode');

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
            calculateFill={neutralFill}
            minScale="0"
            maxScale="1000000"
          />
          <CentroidCircleMap
            regionsGeoJSON={this.state.statesGeoJSON}
            buildTooltip={buildTooltip}
            calculateFill={calculateFill}
            calculateArea={calculateArea}
            minScale="0"
            maxScale="2"
          />
          <Map
            regionsGeoJSON={this.state.countiesGeoJSON}
            buildTooltip={buildTooltip}
            calculateFill={neutralFill}
            minScale="2"
            maxScale="1000000"
          />
          <CentroidCircleMap
            regionsGeoJSON={this.state.countiesGeoJSON}
            buildTooltip={buildTooltip}
            calculateFill={calculateFill}
            calculateArea={calculateArea}
            minScale="2"
            maxScale="1000000"
          />
        </ZoomableGroup>
      </div>
    );
  }
}

export default App;
