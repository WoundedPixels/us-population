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

  constructor(props: Object) {
    super(props);
    this.update = this.update.bind(this);
    this.updateTooltip = this.updateTooltip.bind(this);
    this.clearTooltip = this.clearTooltip.bind(this);
  }

  componentDidMount() {
    this.update();
  }
  componentDidUpdate() {
    this.update();
  }

  init() {
    const node = d3.select(this.node);
    node.append('g').attr('class', 'regions');
  }

  readyCheck() {
    return (
      this.props.regionsGeoJSON && Array.isArray(this.props.regionsGeoJSON)
    );
  }

  updateTooltip(d: Object) {
    Tooltip.update(this.props.buildTooltip(d));
  }

  clearTooltip() {
    Tooltip.update('');
  }

  update() {
    if (!this.readyCheck()) {
      return;
    }

    const node = d3.select(this.node);
    if (node.select('g.regions').empty()) {
      this.init();
    }

    const scale = this.props.width / 950;
    const path = d3.geoPath();

    const regionsG = node
      .select('g.regions')
      .attr('transform', `scale(${scale})`);

    const regionPaths = regionsG
      .selectAll('path.region')
      .data(this.props.regionsGeoJSON);

    regionPaths
      .enter()
      .append('path')
      .attr('class', 'region')
      .attr('d', path)
      .attr('fill', this.props.calculateFill)
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
