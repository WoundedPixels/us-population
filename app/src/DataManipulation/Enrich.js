// @flow

import { arrayToMap } from './ArrayToMap';

const enrich = (geoJSON: Object, dataArray: [], dataKey: string) => {
  const dataMap = arrayToMap(dataArray, dataKey);
  geoJSON.forEach(feature => {
    const data = dataMap[feature.id];
    if (data) {
      Object.keys(data).forEach(key => {
        feature.properties[key] = data[key];
      });
    }
  });
  return {};
};

export { enrich };
