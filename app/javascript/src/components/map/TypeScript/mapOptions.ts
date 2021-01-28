const MapOptions = {
  center: {
    lat: 45.05,
    lng: -90.275,
  },
  mapTypeControl: true,
  mapTypeControlOptions: {
    mapTypeIds: ['terrain', 'satellite', 'hybrid'],
    position: 3
  },
  mapTypeId: 'terrain',
  maxZoom: 12,
  minZoom: 6,
  streetViewControl: false,
  zoomControl: false,
  zoom: 7,
}

export default MapOptions
