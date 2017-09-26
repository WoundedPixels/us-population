import { enrich } from './Enrich';
import { arrayToMap } from './ArrayToMap';
import { topoToGeo } from './TopoToGeo';

it('tolerates missing values', () => {
  const topoJSON = require('../../public/topo-json/us-10m.json');
  const statesGeoJSON = topoToGeo(topoJSON, 'states');

  const data = [
    {
      STATE_FIPS: '01',
      STATE_NAME: 'Alabama',
    },
    {
      STATE_FIPS: '02',
      STATE_NAME: 'Alaska',
    },
    {
      STATE_FIPS: '04',
      STATE_NAME: 'Arizona',
    },
    {
      STATE_FIPS: '05',
      STATE_NAME: 'Arkansas',
    },
  ];

  enrich(statesGeoJSON, data, 'STATE_FIPS');

  expect(statesGeoJSON[0].properties.STATE_NAME).toEqual('Arkansas');
});
