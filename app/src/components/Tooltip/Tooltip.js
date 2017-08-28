// @flow

import React, { Component } from 'react';
import * as d3 from 'd3';

import './Tooltip.css';

class Tooltip extends Component {
  static update(content: string) {
    const tooltip = d3.select('div#tooltip');

    const mouse = { x: d3.event.pageX, y: d3.event.pageY };

    const tooltipDimensions = tooltip.node().getBoundingClientRect();

    const left = Math.min(
      mouse.x + 5,
      window.innerWidth - tooltipDimensions.width - 5,
    );

    tooltip
      .html(content)
      .style('left', `${left}px`)
      .style('top', `${mouse.y - tooltipDimensions.height - 5}px`)
      .style('display', content === '' ? 'none' : 'block');
  }

  render() {
    return (
      <div className="Tooltip" id="tooltip" style={{ display: 'none' }}>
        {this.props.children}
      </div>
    );
  }
}

export default Tooltip;
