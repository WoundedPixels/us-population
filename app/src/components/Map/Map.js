// @flow

import React, { Component } from 'react';
import * as d3 from 'd3';

import Tooltip from '../Tooltip/Tooltip';

import './Map.css';

const defaultCalculateFill = d => {
  return '#D3D3D3';
};

const defaultcalculateStroke = d => {
  return '#333';
};

const defaultcalculateStrokeWidth = d => {
  return 1.5;
};

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

  shouldComponentUpdate(nextProps: Object) {
    if (!this.readyCheck()) {
      return true;
    }
    return this.props.scale !== nextProps.scale;
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
    Tooltip.update();
  }

  update() {
    if (!this.readyCheck()) {
      return;
    }

    const calculateFill = this.props.calculateFill || defaultCalculateFill;
    const calculateStroke =
      this.props.calculateStroke || defaultcalculateStroke;
    const calculateStrokeWidth =
      this.props.calculateStrokeWidth || defaultcalculateStrokeWidth;

    const node = d3.select(this.node);
    if (node.select('g.regions').empty()) {
      this.init();
    }

    const path = d3.geoPath();

    const regionsG = node.select('g.regions');

    const regionPaths = regionsG
      .selectAll('path.region')
      .data(this.props.regionsGeoJSON);

    regionPaths
      .enter()
      .append('path')
      .attr('class', 'region')
      .attr('d', path)
      .attr('fill', calculateFill)
      .attr('stroke', calculateStroke)
      .attr('stroke-width', d => {
        return calculateStrokeWidth(d) / this.props.scale;
      })
      .on('mouseover', this.updateTooltip)
      .on('mousemove', this.updateTooltip)
      .on('mouseleave', this.clearTooltip);

    regionPaths
      .attr('fill', calculateFill)
      .attr('stroke', calculateStroke)
      .attr('stroke-width', d => {
        return calculateStrokeWidth(d) / this.props.scale;
      });
  }

  render() {
    console.log('Map render');

    if (!this.readyCheck()) {
      return <text transform="translate(50,50)">Loading</text>;
    }

    return <g className="Map" ref={node => (this.node = node)} />;
  }
}

export default Map;
