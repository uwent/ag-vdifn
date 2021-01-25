const MapOptions = {
  center: {
    lat: 45.05026979463,
    lng: -90.274658203125,
  },
  mapTypeControl: true,
  mapTypeControlOptions: {
    mapTypeIds: ['terrain', 'hybrid'],
  },
  // mapTypeControlOptions: {
  //   mapTypeIds: ['terrain', 'hybrid'],
  //   position: google.maps.ControlPosition.TOP_RIGHT,
  // },
  mapTypeId: 'terrain',
  maxZoom: 12,
  minZoom: 6,
  streetViewControl: false,
  zoomControl: false,
  zoom: 7,
}

export default MapOptions
