// @flow

import React, { Component } from 'react';
import classNames from 'classnames';
import * as d3 from 'd3';

import Tooltip from '../Tooltip/Tooltip';

import './CentroidCircleMap.css';

class CentroidCircleMap extends Component {
  init: Function;
  update: Function;
  updateTooltip: Function;
  clearTooltip: Function;
  node: Object;
  sortedRegionsGeoJSON: [];

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

    this.sortedRegionsGeoJSON = this.props.regionsGeoJSON.sort((a, b) => {
      return b.properties.allAgesCount - a.properties.allAgesCount;
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

    const node = d3.select(this.node);
    if (node.select('g.bubbles').empty()) {
      this.init();
    }

    const bubblesG = node.select('g.bubbles');

    const circles = bubblesG
      .selectAll('circle.bubble')
      .data(this.sortedRegionsGeoJSON);

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
        return (
          Math.sqrt(this.props.calculateArea(d) / Math.PI) / this.props.scale
        );
      })
      .attr('fill', this.props.calculateFill)
      // .attr('stroke-width', 1 / this.props.scale)
      .on('mouseover', this.updateTooltip)
      .on('mousemove', this.updateTooltip)
      .on('mouseleave', this.clearTooltip);

    // circles.attr('stroke-width', 1.5 / this.props.scale);
    circles.attr('r', d => {
      return (
        Math.sqrt(this.props.calculateArea(d) / Math.PI) / this.props.scale
      );
    });
  }

  render() {
    console.log('CentroidCircleMap render');
    const minScale = +this.props.minScale;
    const maxScale = +this.props.maxScale;
    const hidden = this.props.scale < minScale || this.props.scale > maxScale;

    if (!this.readyCheck()) {
      return <text transform="translate(50,50)">Loading</text>;
    }

    const classnames = classNames('CentroidCircleMap', { hidden: hidden });
    return <g className={classnames} ref={node => (this.node = node)} />;
  }
}

export default CentroidCircleMap;
