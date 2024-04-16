import RectangleOption from '@ts/map/rectangleOption';

const latitude = 41.88;
const longitude = -87.62;
const latitudeOffset = 0.05;
const longitudeOffset = 0.05;
const color = '#ffff';
const map = {};

test('returns properties', () => {
  const rectangleOption = new RectangleOption(latitude, longitude, color, map);

  expect(rectangleOption.latitude).toEqual(latitude);
  expect(rectangleOption.longitude).toEqual(longitude);
  expect(rectangleOption.fillColor).toEqual(color);
  expect(rectangleOption.map).toEqual(map);

  expect(rectangleOption.bounds).toEqual({
    north: latitude - latitudeOffset,
    south: latitude + latitudeOffset,
    east: longitude + longitudeOffset,
    west: longitude - longitudeOffset,
  });

  // defaults
  expect(rectangleOption.strokeColor).toBeTypeOf('string');
  expect(rectangleOption.strokeOpacity).toBeTypeOf('number');
  expect(rectangleOption.strokeWeight).toBeTypeOf('number');
  expect(rectangleOption.fillOpacity).toBeTypeOf('number');
});
