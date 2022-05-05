import RectangleOption from './rectangleOption'

export default class GoogleWrapper {
  google

  constructor(google) {
    this.google = google
  }

  createMap(container, options): any {
    return new this.google.maps.Map(container, options)
  }

  latLng(latitude: number, longitude: number) {
    return new this.google.maps.LatLng(latitude, longitude)
  }

  createRectangle(RectangleOption: RectangleOption) {
    return new this.google.maps.Rectangle(RectangleOption)
  }

  createBounds(bounds, map) {
    return new this.google.maps.Rectangle({
      strokeColor: "#000000",
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillOpacity: 0,
      map: map,
      bounds: bounds,
      clickable: false,
    })
  }

  createInfoWindow(options) {
    return new this.google.maps.InfoWindow(options)
  }
}
