export default class RectangleOption {
  severityLevel: number
  latitude: number
  longitude: number
  strokeColor: string = "6c6c6c"
  strokeOpacity = 0.75
  strokeWeight = 0.025
  fillColor: string
  fillOpacity = 0.4
  map: any

  private latitudeOffset = 0.05
  private longitudeOffset = 0.05

  bounds: {
    north: number
    south: number
    east: number
    west: number
  }

  constructor(latitude: number, longitude: number, fillColor: string, map: any) {
    this.latitude = latitude
    this.longitude = longitude
    this.fillColor = fillColor
    this.bounds = this.calculateBounds()
    this.map = map
  }

  private calculateBounds() {
    return {
      north: this.latitude - this.latitudeOffset,
      south: this.latitude + this.latitudeOffset,
      east: this.longitude + this.longitudeOffset,
      west: this.longitude - this.longitudeOffset
    }
  }
}
