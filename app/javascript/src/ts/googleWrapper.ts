import RectangleOption from './rectangleOption';

// Define minimal interfaces for Google Maps types
interface GoogleMapsAPI {
  maps: {
    Map: any;
    LatLng: any;
    Rectangle: any;
    InfoWindow: any;
  };
}

export default class GoogleWrapper {
  private google: GoogleMapsAPI;

  constructor(google: GoogleMapsAPI) {
    this.google = google;
  }

  createMap(container: HTMLElement, options: any): any {
    return new this.google.maps.Map(container, options);
  }

  latLng(latitude: number, longitude: number): any {
    return new this.google.maps.LatLng(latitude, longitude);
  }

  createRectangle(options: RectangleOption): any {
    return new this.google.maps.Rectangle(options);
  }

  createBounds(bounds: any, map: any): any {
    return new this.google.maps.Rectangle({
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillOpacity: 0,
      map: map,
      bounds: bounds,
      clickable: false,
    });
  }

  createInfoWindow(options: any): any {
    return new this.google.maps.InfoWindow(options);
  }
}
