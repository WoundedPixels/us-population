// @flow

import React, { Component } from 'react';
import * as d3 from 'd3';

import './ZoomableGroup.css';

class ZoomableGroup extends Component {
  renderChildren: Function;
  init: Function;
  zoomed: Function;
  node: Object;
  viewG: Object;

  state: { scale: number };

  constructor(props: Object) {
    super(props);
    this.renderChildren = this.renderChildren.bind(this);
    this.init = this.init.bind(this);
    this.zoomed = this.zoomed.bind(this);

    this.state = { scale: 1 };
  }

  componentDidMount() {
    this.init();
  }

  init() {
    const zoom = d3.zoom().scaleExtent([1, 40]).on('zoom', this.zoomed);
    const node = d3.select(this.node);
    node.call(zoom);

    this.viewG = node.select('g');
  }

  zoomed() {
    const { transform } = d3.event;
    this.viewG.attr('transform', transform);
    this.setState({ scale: transform.k });
  }

  renderChildren() {
    return React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        scale: this.state.scale,
      });
    });
  }

  render() {
    const transform = `scale(${this.state.scale})`;

    return (
      <svg
        className="ZoomableGroup"
        width={this.props.width}
        height={this.props.height}
        ref={node => (this.node = node)}
      >
        <g transform={transform}>
          {this.renderChildren()}
        </g>
      </svg>
    );
  }
}

export default ZoomableGroup;
