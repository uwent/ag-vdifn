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

  strokeColor: string;
  strokeOpacity: number;
  strokeWeight: number;
  fillOpacity: number;

  private latitudeOffset: number;
  private longitudeOffset: number;

  constructor(
    latitude: number,
    longitude: number,
    map: any,
    options: {
      latitudeOffset?: number;
      longitudeOffset?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
      fillColor?: string;
      fillOpacity?: number;
    } = {},
  ) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.map = map;
    this.severityLevel = null;

    this.latitudeOffset = options.latitudeOffset ?? 0.05;
    this.longitudeOffset = options.longitudeOffset ?? 0.05;

    this.strokeColor = options.strokeColor ?? '#000000';
    this.strokeOpacity = options.strokeOpacity ?? 1;
    this.strokeWeight = options.strokeWeight ?? 0.025;
    this.fillColor = options.fillColor ?? '#ffffff00';
    this.fillOpacity = options.fillOpacity ?? 0.5;

    this.bounds = this.calculateBounds();
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
