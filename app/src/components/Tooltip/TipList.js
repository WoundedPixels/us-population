// @flow

import React from 'react';
import * as d3 from 'd3';

const buildTips = (data: Object, patterns: Object[]) => {
  const tips = patterns.map((pattern, index) => {
    const raw = data[pattern.source];
    const value = pattern.format ? d3.format(pattern.format)(raw) : raw;

    return (
      <div key={index}>
        <span className="label">
          {pattern.label}:
        </span>
        <span className="value">
          {value}
        </span>
      </div>
    );
  });

  return (
    <ul>
      {tips}
    </ul>
  );
};

export { buildTips };
