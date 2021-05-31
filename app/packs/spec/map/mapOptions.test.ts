import MapOptions from '../../src/components/map/TypeScript/mapOptions'
it('returns map options object', () => {
  expect(MapOptions).toEqual({
    center: {
      lat: 45.05,
      lng: -90.275,
    },
    mapTypeControl: true,
    mapTypeControlOptions: {
      mapTypeIds: ['terrain', 'satellite', 'hybrid'],
      position: 3,
    },
    mapTypeId: 'terrain',
    maxZoom: 12,
    minZoom: 6,
    streetViewControl: false,
    zoomControl: true,
    zoomControlOptions: {
      position: 7,
    },
    zoom: 7,
  })
})
