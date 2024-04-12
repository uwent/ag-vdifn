import MapOptions from '@components/map/ts/mapOptions';

test('returns map options object', () => {
  expect(MapOptions).toEqual({
    center: {
      lat: 45.05,
      lng: -90.275,
    },
    mapTypeControl: true,
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'terrain', 'satellite'],
      position: 3,
    },
    mapTypeId: 'terrain',
    maxZoom: 14,
    minZoom: 5,
    streetViewControl: false,
    zoomControl: true,
    zoomControlOptions: {
      position: 7,
    },
    zoom: 7,
    styles: expect.anything(),
  });
});
