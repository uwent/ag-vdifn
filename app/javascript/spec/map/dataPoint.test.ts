import DataPoint from '@components/map/ts/dataPoint';
import { COLORS } from '@components/common/ts/colors';

const latitude = 41.88;
const longitude = -87.62;
const strokeOpacity = 1.0;
const strokeWeight = 0.05;
const color = '#ffff';
const fillOpacity = 0.25;
const map: any = {};

test('returns properties', () => {
  const dataPointOptions = new DataPoint(latitude, longitude, color, map);
  expect(dataPointOptions.latitude).toEqual(latitude);
  expect(dataPointOptions.longitude).toEqual(longitude);
  expect(dataPointOptions.strokeColor).toEqual(COLORS.brightRed);
  expect(dataPointOptions.strokeOpacity).toEqual(strokeOpacity);
  expect(dataPointOptions.strokeWeight).toEqual(strokeWeight);
  expect(dataPointOptions.fillColor).toEqual(color);
  expect(dataPointOptions.map).toEqual(map);
  expect(dataPointOptions.fillOpacity).toEqual(fillOpacity);
  expect(dataPointOptions.bounds).toEqual({
    north: 41.830000000000005,
    south: 41.93,
    east: -87.57000000000001,
    west: -87.67,
  });
});
