import { COLORS } from '../../common/TypeScript/colors'
export default class RectangleOption {
  severityLevel: number
  latitude: number
  longitude: number
  strokeColor: string = COLORS.brightRed
  strokeOpacity: number = 1.0
  strokeWeight: number = 0.05
  fillColor: string
  fillOpacity: number = 0.2
  map: any
  private cornerOffset: number = 0.0025
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
      north: this.latitude - this.latitudeOffset - this.cornerOffset,
      south: this.latitude + this.latitudeOffset + this.cornerOffset,
      east: this.longitude + this.longitudeOffset + this.cornerOffset,
      west: this.longitude - this.longitudeOffset - this.cornerOffset,
    }
  }
}
