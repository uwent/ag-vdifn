import MapOptions from '@ts/map/mapOptions';

test('returns map options object', () => {
  expect(MapOptions).toEqual({
    center: {
      lat: 44.75,
      lng: -89.9,
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
