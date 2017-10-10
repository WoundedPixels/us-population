// @flow

import React, { Component } from 'react';
import * as d3 from 'd3';
import { interpolateYlOrRd } from 'd3-scale-chromatic';
import { RadioGroup, Radio } from 'react-mdl';

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

const noFill = d => 'none';

const blackStroke = d => 'black';
const greyStroke = d => '#444';

const thinStrokeWidth = d => 0.5;
const thickStrokeWidth = d => 2;

const childrenTooltip = d => {
  const {
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
      <Tip label="Children:" value={d3.format(',')(childrenCount)} />
      <Tip
        label="Children in Poverty:"
        value={d3.format(',')(childrenPovertyCount)}
      />
    </Tips>
  );
};

const adultTooltip = d => {
  const {
    adultCount,
    adultPovertyCount,
    adultPovertyRatio,
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
        label="Adult Poverty Rate:"
        value={d3.format('.1%')(adultPovertyRatio)}
      />
      <Tip label="Adult Population:" value={d3.format(',')(adultCount)} />
      <Tip
        label="Adults in Poverty:"
        value={d3.format(',')(adultPovertyCount)}
      />
    </Tips>
  );
};

const allAgesTooltip = d => {
  const {
    allAgesCount,
    allAgesPovertyCount,
    allAgesPovertyRatio,
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
        label="Poverty Rate:"
        value={d3.format('.1%')(allAgesPovertyRatio)}
      />
      <Tip label="Population:" value={d3.format(',')(allAgesCount)} />
      <Tip
        label="Population in Poverty:"
        value={d3.format(',')(allAgesPovertyCount)}
      />
    </Tips>
  );
};

const tooltipFunctions = {
  adult: adultTooltip,
  allAges: allAgesTooltip,
  children: childrenTooltip,
};

class App extends Component {
  state: Object;

  buildTooltip: Function;
  calculateArea: Function;
  calculateFill: Function;
  calculateNeutralFill: Function;
  onAgeSelection: Function;

  constructor(props: Object) {
    super(props);

    this.buildTooltip = this.buildTooltip.bind(this);
    this.calculateArea = this.calculateArea.bind(this);
    this.calculateFill = this.calculateFill.bind(this);
    this.calculateNeutralFill = this.calculateNeutralFill.bind(this);
    this.onAgeSelection = this.onAgeSelection.bind(this);

    this.state = {
      countiesGeoJSON: Object,
      statesGeoJSON: Object,
      selectedAge: String,
      lastUpdate: Number,
    };

    this.state.selectedAge = 'allAges';
  }

  buildTooltip(d: Object) {
    const tipFunction = tooltipFunctions[this.state.selectedAge];
    return tipFunction(d);
  }

  calculateArea(d: Object) {
    const property = `${this.state.selectedAge}Count`;
    if (!d.properties || !d.properties[property]) {
      console.log('no population', JSON.stringify(d));
    }

    const count = d.properties[property] || 0;
    return count / 2500;
  }

  calculateFill(d: Object) {
    const property = `${this.state.selectedAge}PovertyRatio`;
    return colorScale(d.properties[property]);
  }

  calculateNeutralFill(d: Object) {
    const property = `${this.state.selectedAge}PovertyRatio`;
    return d.properties[property] < 0.35 ? '#EEEEEE' : '#FFFFFF';
  }

  onAgeSelection(event: Object) {
    this.setState({
      lastUpdate: Date.now(),
      selectedAge: event.currentTarget.value,
    });
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

        povertyData.forEach(row => {
          row.adultCount = row.allAgesCount - row.childrenCount;
          row.adultPovertyCount =
            row.allAgesPovertyCount - row.childrenPovertyCount;
          row.adultPovertyRatio = row.adultPovertyCount / row.adultCount;
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
    console.log('App render');
    const width = 950;
    const height = 0.65 * width;

    const lastUpdate = this.state.lastUpdate || 0;
    const selectedAge = this.state.selectedAge;

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
          <h1>Poverty in the US</h1>
        </div>
        <div className="content">
          <Tooltip />
          <ZoomableGroup width={width} height={height}>
            <Map
              regionsGeoJSON={this.state.statesGeoJSON}
              buildTooltip={this.buildTooltip}
              calculateFill={this.calculateNeutralFill}
              lastUpdate={lastUpdate}
              minScale="0"
              maxScale="2"
            />
            <Map
              regionsGeoJSON={this.state.countiesGeoJSON}
              buildTooltip={this.buildTooltip}
              calculateFill={this.calculateNeutralFill}
              lastUpdate={lastUpdate}
              minScale="2"
              maxScale="1000000"
            />
            <Map
              regionsGeoJSON={this.state.statesGeoJSON}
              buildTooltip={this.buildTooltip}
              calculateFill={noFill}
              calculateStroke={blackStroke}
              calculateStrokeWidth={thickStrokeWidth}
              lastUpdate={lastUpdate}
              minScale="2"
              maxScale="1000000"
            />
            <CentroidCircleMap
              buildTooltip={this.buildTooltip}
              calculateArea={this.calculateArea}
              calculateFill={this.calculateFill}
              calculateStroke={greyStroke}
              calculateStrokeWidth={thinStrokeWidth}
              lastUpdate={lastUpdate}
              maxScale="2"
              minScale="0"
              regionsGeoJSON={this.state.statesGeoJSON}
            />
            <CentroidCircleMap
              buildTooltip={this.buildTooltip}
              calculateArea={this.calculateArea}
              calculateFill={this.calculateFill}
              calculateStroke={greyStroke}
              calculateStrokeWidth={thinStrokeWidth}
              lastUpdate={lastUpdate}
              maxScale="1000000"
              minScale="2"
              regionsGeoJSON={this.state.countiesGeoJSON}
            />
          </ZoomableGroup>
          <ColorScaleLegend {...colorScaleProps} />
          <RadioGroup
            name="ages"
            value={selectedAge}
            onChange={this.onAgeSelection}
          >
            <Radio value="allAges">All Ages</Radio>
            <Radio value="adult">Adults</Radio>
            <Radio value="children">Children</Radio>
          </RadioGroup>
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
