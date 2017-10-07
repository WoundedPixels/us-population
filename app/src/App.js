// @flow

import React, { Component } from 'react';
import * as d3 from 'd3';
import { interpolateYlOrRd } from 'd3-scale-chromatic';

import ZoomableGroup from './components/ZoomableGroup/ZoomableGroup';
import CentroidCircleMap from './components/CentroidCircleMap/CentroidCircleMap';
import ColorScaleLegend from './components/ColorScaleLegend/ColorScaleLegend';
import Map from './components/Map/Map';
import Tooltip from './components/Tooltip/Tooltip';
import Tips from './components/Tooltip/Tips';
import Tip from './components/Tooltip/Tip';

import { topoToGeo, enrich } from './DataManipulation';

import './App.css';

const BASE_PATH =
  'https://raw.githubusercontent.com/WoundedPixels/us-population/gh-pages/';

const colorScale = d3.scaleSequential(interpolateYlOrRd).domain([0.1, 0.4]);

const calculateArea = d => {
  if (!d.properties || !d.properties.allAgesCount) {
    console.log('no population', JSON.stringify(d));
  }

  const count = d.properties.allAgesCount || 0;
  return count / 2500;
};

const calculateFill = d => {
  return colorScale(d.properties.childrenPovertyRatio);
};

const neutralFill = d => {
  return d.properties.childrenPovertyRatio < 0.35 ? '#EEEEEE' : '#FFFFFF';
};

const calculateStroke = d => {
  return 'black';
};

const calculateStrokeWidth = d => {
  return 0.5;
};

const buildTooltip = d => {
  const {
    allAgesCount,
    childrenCount,
    childrenPovertyRatio,
    childrenPovertyCount,
    name,
    stateAbbreviation,
  } = d.properties;

  const fullname = name.includes('County')
    ? `${name}, ${stateAbbreviation}`
    : name;

  return (
    <Tips>
      <Tip label={fullname} />
      <Tip
        label="Childhood Poverty Rate:"
        value={d3.format('.1%')(childrenPovertyRatio)}
      />
      <Tip label="Population:" value={d3.format(',')(allAgesCount)} />
      <Tip label="Children:" value={d3.format(',')(childrenCount)} />
      <Tip
        label="Children in Poverty:"
        value={d3.format(',')(childrenPovertyCount)}
      />
    </Tips>
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

    const colorScaleProps = {
      blockHeight: 50,
      blockWidth: 60,
      colorScale,
      format: '.0%',
      values: [0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4],
    };

    return (
      <div id="App">
        <div className="content">
          <h1>Childhood Poverty in the US</h1>
        </div>
        <div className="content">
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
              buildTooltip={buildTooltip}
              calculateArea={calculateArea}
              calculateFill={calculateFill}
              calculateStroke={calculateStroke}
              calculateStrokeWidth={calculateStrokeWidth}
              maxScale="2"
              minScale="0"
              regionsGeoJSON={this.state.statesGeoJSON}
            />
            <Map
              regionsGeoJSON={this.state.countiesGeoJSON}
              buildTooltip={buildTooltip}
              calculateFill={neutralFill}
              minScale="2"
              maxScale="1000000"
            />
            <CentroidCircleMap
              buildTooltip={buildTooltip}
              calculateArea={calculateArea}
              calculateFill={calculateFill}
              calculateStroke={calculateStroke}
              calculateStrokeWidth={calculateStrokeWidth}
              maxScale="1000000"
              minScale="2"
              regionsGeoJSON={this.state.countiesGeoJSON}
            />
          </ZoomableGroup>
          <ColorScaleLegend {...colorScaleProps} />
        </div>
        <div className="footer">
          Created by{' '}
          <a href="https://github.com/WoundedPixels/us-population">
            WoundedPixels
          </a>{' '}
          Based on{' '}
          <a href="https://www.census.gov/did/www/saipe/data/statecounty/data/2015.html">
            2015 US Census Data
          </a>
        </div>
      </div>
    );
  }
}

export default App;
