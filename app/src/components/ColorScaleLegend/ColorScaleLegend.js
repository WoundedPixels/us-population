// @flow

import React, { Component } from 'react';
import * as d3 from 'd3';

import './ColorScaleLegend.css';

class ColorScaleLegend extends Component {
  render() {
    const { blockHeight, blockWidth, colorScale, format, values } = this.props;

    return (
      <div
        className="ColorScaleLegend"
        style={{
          width: `${blockWidth * values.length}px`,
        }}
      >
        {values.map((value, index) => {
          const colorAreaStyle = {
            backgroundColor: colorScale(value),
            height: `${blockHeight}px`,
            width: `${blockWidth}px`,
          };
          return (
            <div key={index} className="block">
              <div className="label">
                {d3.format(format)(value)}
              </div>
              <div style={colorAreaStyle} />
            </div>
          );
        })}
      </div>
    );
  }
}

export default ColorScaleLegend;
