// @flow

import React, { Component } from 'react';
import * as d3 from 'd3';

import Tooltip from '../Tooltip/Tooltip';

import './CentroidCircleMap.css';

const defaultCalculateFill = d => '#D3D3D3';
const defaultcalculateStroke = d => 'none';
const defaultcalculateStrokeWidth = d => 0;

class CentroidCircleMap extends Component {
  clearTooltip: Function;
  init: Function;
  node: Object;
  update: Function;
  updateTooltip: Function;

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
    const path = d3.geoPath();

    const node = d3.select(this.node);
    node.append('g').attr('class', 'bubbles');

    this.props.regionsGeoJSON.forEach(region => {
      region.properties.centroid = path.centroid(region);
    });
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

    const calculateArea = this.props.calculateArea;
    const calculateFill = this.props.calculateFill || defaultCalculateFill;
    const calculateStroke =
      this.props.calculateStroke || defaultcalculateStroke;
    const calculateStrokeWidth =
      this.props.calculateStrokeWidth || defaultcalculateStrokeWidth;

    const node = d3.select(this.node);
    if (node.select('g.bubbles').empty()) {
      this.init();
    }

    const bubblesG = node.select('g.bubbles');

    const regions = [...this.props.regionsGeoJSON];
    regions.sort((a, b) => {
      return b.properties.allAgesCount - a.properties.allAgesCount;
    });

    const circles = bubblesG.selectAll('circle.bubble').data(regions);

    circles
      .enter()
      .append('circle')
      .attr('class', 'bubble')
      .attr('cx', d => {
        return d.properties.centroid[0];
      })
      .attr('cy', d => {
        return d.properties.centroid[1];
      })
      .attr('r', d => {
        return Math.sqrt(calculateArea(d) / Math.PI) / this.props.scale;
      })
      .attr('fill', calculateFill)
      .attr('stroke', calculateStroke)
      .attr('stroke-width', d => {
        return calculateStrokeWidth(d) / this.props.scale;
      })
      .on('mouseover', this.updateTooltip)
      .on('mousemove', this.updateTooltip)
      .on('mouseleave', this.clearTooltip);

    circles
      .attr('r', d => {
        return Math.sqrt(calculateArea(d) / Math.PI) / this.props.scale;
      })
      .attr('fill', calculateFill)
      .attr('stroke', calculateStroke)
      .attr('stroke-width', d => {
        return calculateStrokeWidth(d) / this.props.scale;
      });
  }

  render() {
    if (!this.readyCheck()) {
      return <text transform="translate(50,50)">Loading</text>;
    }

    return <g ref={node => (this.node = node)} />;
  }
}

export default CentroidCircleMap;
