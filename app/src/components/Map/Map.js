// @flow

import React, { Component } from 'react';
import * as d3 from 'd3';

import Tooltip from '../Tooltip/Tooltip';

import './Map.css';

class Map extends Component {
  init: Function;
  update: Function;
  updateTooltip: Function;
  clearTooltip: Function;
  node: Object;
  ready: boolean;

  constructor(props: Object) {
    super(props);
    this.update = this.update.bind(this);
    this.updateTooltip = this.updateTooltip.bind(this);
    this.clearTooltip = this.clearTooltip.bind(this);

    this.ready = false;
  }

  componentDidMount() {
    this.update();
  }
  componentDidUpdate() {
    this.update();
  }

  init() {
    const node = d3.select(this.node);
    node.append('g').attr('class', 'states');
    node.append('g').attr('class', 'counties');
  }

  readyCheck() {
    this.ready = this.props.statesGeoJSON && this.props.countiesGeoJSON;
    return this.ready;
  }

  updateTooltip(d: Object) {
    Tooltip.update(`d: ${d.id}</br>${JSON.stringify(d.properties)}`);
  }

  clearTooltip() {
    Tooltip.update('');
  }

  update() {
    if (!this.readyCheck()) {
      return;
    }

    const node = d3.select(this.node);
    if (node.select('g.states').empty()) {
      this.init();
    }

    const scale = this.props.width / 950;
    const path = d3.geoPath();

    const statesG = node
      .select('g.states')
      .attr('transform', `scale(${scale})`);

    const statePaths = statesG
      .selectAll('path.state')
      .data(this.props.statesGeoJSON);

    statePaths
      .enter()
      .append('path')
      .attr('class', 'state')
      .attr('d', path)
      .on('mouseover', this.updateTooltip)
      .on('mousemove', this.updateTooltip)
      .on('mouseleave', this.clearTooltip);

    const countiesG = node
      .select('g.counties')
      .attr('transform', `scale(${scale})`);

    const countyPaths = countiesG
      .selectAll('path.county')
      .data(this.props.countiesGeoJSON);

    countyPaths
      .enter()
      .append('path')
      .attr('class', 'county')
      .attr('d', path)
      .on('mouseover', this.updateTooltip)
      .on('mousemove', this.updateTooltip)
      .on('mouseleave', this.clearTooltip);
  }

  render() {
    return this.readyCheck()
      ? <svg
          className="Map"
          ref={node => (this.node = node)}
          width={this.props.width}
          height={0.65 * this.props.width}
        />
      : <div>Loading</div>;
  }
}

export default Map;
