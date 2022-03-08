const MapOptions = {
  center: {
    lat: 45.05,
    lng: -90.275
  },
  mapTypeControl: true,
  mapTypeControlOptions: {
    mapTypeIds: ['terrain', 'satellite', 'hybrid'],
    position: 3
  },
  mapTypeId: 'terrain',
  maxZoom: 12,
  minZoom: 5,
  streetViewControl: false,
  zoomControl: true,
  zoomControlOptions: {
    position: 7
  },
  zoom: 7
}

export default MapOptions
