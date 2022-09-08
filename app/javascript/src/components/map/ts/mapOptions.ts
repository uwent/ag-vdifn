import { LightGreyStyle } from "./mapStyles"

const MapOptions = {
  center: {
    lat: 45.05,
    lng: -90.275
  },
  mapTypeControl: true,
  mapTypeControlOptions: {
    mapTypeIds: ['roadmap', 'terrain', 'satellite'],
    position: 3
  },
  mapTypeId: 'terrain',
  maxZoom: 14,
  minZoom: 5,
  streetViewControl: false,
  zoomControl: true,
  zoomControlOptions: {
    position: 7
  },
  zoom: 7,
  styles: LightGreyStyle
}

export default MapOptions
