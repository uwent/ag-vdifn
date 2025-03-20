export default class RectangleOption {
  map: any;
  latitude: number;
  longitude: number;
  severityLevel: number | null;
  fillColor: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };

  // strokeColor: string = "6c6c6c"
  strokeColor = '#000000';
  strokeOpacity = 1;
  strokeWeight = 0.025;
  fillOpacity = 0.5;

  private latitudeOffset = 0.05;
  private longitudeOffset = 0.05;

  constructor(latitude: number, longitude: number, map: any) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.fillColor = '#ffffff00';
    this.bounds = this.calculateBounds();
    this.map = map;
    this.severityLevel = null;
  }

  private calculateBounds() {
    return {
      north: this.latitude - this.latitudeOffset,
      south: this.latitude + this.latitudeOffset,
      east: this.longitude + this.longitudeOffset,
      west: this.longitude - this.longitudeOffset,
    };
  }
}
