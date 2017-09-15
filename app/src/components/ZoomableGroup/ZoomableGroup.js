// @flow

import React, { Component } from 'react';
import './ZoomableGroup.css';

class ZoomableGroup extends Component {
  renderChildren: Function;
  state: { scale: number };

  constructor(props: Object) {
    super(props);
    this.renderChildren = this.renderChildren.bind(this);
    this.state = { scale: 1 };

    // setInterval(() => {
    //   const newScale = Math.random() * 4;
    //   console.log('newScale', newScale);
    //   this.setState({ scale: newScale });
    // }, 1000);
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
      >
        <g transform={transform}>
          {this.renderChildren()}
        </g>
      </svg>
    );
  }
}

export default ZoomableGroup;
