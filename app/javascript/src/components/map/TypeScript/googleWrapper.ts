import DataPoint from "./dataPoint";

export default class GoogleWrapper {
    google;

    constructor(google) {
        this.google = google;
    }

    createMap(container, options): any {
        return new this.google.maps.Map(container, options)
    }

    latLng(latitude: number, longitude: number) {
        return new this.google.maps.LatLng(latitude, longitude);
    }
    
    createRectangle(dataPoint: DataPoint) {
        return new this.google.maps.Rectangle(dataPoint);
    }

    createInfoWindow(options) {
        return new this.google.maps.InfoWindow(options)
    }
}
