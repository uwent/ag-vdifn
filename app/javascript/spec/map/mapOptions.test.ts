import MapOptions from '../../src/components/map/TypeScript/mapOptions'
it('returns map options object', () => {
    expect(MapOptions).toEqual({
        center: {
            lat: 45.05026979463,
            lng: -90.274658203125
        },
          mapTypeControl: true,
          mapTypeControlOptions: {
            mapTypeIds: ['terrain',
                         'hybrid']
          },
          mapTypeId: 'terrain',
          maxZoom: 12,
          minZoom: 6,
          streetViewControl: false,
          zoomControl: false,
          zoom: 7
    })
})

