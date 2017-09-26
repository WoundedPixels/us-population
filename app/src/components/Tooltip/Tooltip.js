// @flow

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

import './Tooltip.css';

class Tooltip extends Component {
  static update(content: Object = <empty />) {
    const tooltip = d3.select('div#tooltip');

    const mouse = { x: d3.event.pageX, y: d3.event.pageY };

    const tooltipDimensions = tooltip.node().getBoundingClientRect();

    const left = Math.min(
      mouse.x + 5,
      window.innerWidth - tooltipDimensions.width - 5,
    );

    tooltip
      .style('left', `${left}px`)
      .style('top', `${mouse.y - tooltipDimensions.height - 5}px`)
      .style('display', content.type !== 'empty' ? 'block' : 'none');

    ReactDOM.render(content, document.getElementById('tooltip'));
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
