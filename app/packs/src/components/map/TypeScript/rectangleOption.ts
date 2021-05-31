import { COLORS } from '../../common/TypeScript/colors'

export default class RectangleOption {
  severityLevel: number
  latitude: number
  longitude: number
  strokeColor: string = COLORS.brightRed
  strokeOpacity: number = 1.0
  strokeWeight: number = 0.05
  fillColor: string
  fillOpacity: number = 0.25
  map: any

  private latitudeOffset: number = 0.05
  private longitudeOffset: number = 0.05

  bounds: { north: number; south: number; east: number; west: number }

  constructor(
    latitude: number,
    longitude: number,
    fillColor: string,
    map: any,
  ) {
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
      west: this.longitude - this.longitudeOffset,
    }
  }
}
