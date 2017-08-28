// @flow

import { arrayToMap } from './ArrayToMap';

const enrich = (
  geoJSON: Object,
  dataArray: [],
  dataKey: string,
  mapping: Object,
) => {
  const dataMap = arrayToMap(dataArray, dataKey);
  geoJSON.forEach(feature => {
    const data = dataMap[feature.id];
    if (data) {
      Object.keys(mapping).forEach(key => {
        const destinationKey = mapping[key];
        feature.properties[destinationKey] = data[key];
      });
    }
  });
  return {};
};

export { enrich };
