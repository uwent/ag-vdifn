import MapOptions from '@ts/map/mapOptions';

test('returns map options object', () => {
  expectTypeOf(MapOptions).toBeObject;
});
