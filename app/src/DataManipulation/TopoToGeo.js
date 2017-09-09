import * as topojson from 'topojson-client';

const topoToGeo = (topoJSON: Object, featureName: string) => {
  return topojson.feature(topoJSON, topoJSON.objects[featureName]).features;
};

export { topoToGeo };
