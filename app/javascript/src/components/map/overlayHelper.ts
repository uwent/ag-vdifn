import { SeverityParams, Severity } from '../common/TypeScript/types';
import DatabaseClient from '../common/TypeScript/databaseClient';
import GoogleWrapper from './TypeScript/googleWrapper';
import DataPoint from './TypeScript/dataPoint';
import infoWindowLoadingTemplate from './TypeScript/templates/infoWindowLoading'
import ColorHelper from './TypeScript/colorHelper';
export default class OverlayHelper {
    googleWrapper: GoogleWrapper;
    rectangles: any;
    infoWindow: any;
    map;
    constructor(googleWrapper: GoogleWrapper, map: any) {
        this.googleWrapper = googleWrapper;
        this.rectangles = [];
        this.map = map;
    }

    async updateOverlay(severityParams: SeverityParams) {
        this.clearRectangles();
        this.closeInfoWindow();
        const severities = await this.getSeverities(severityParams);
        const dataPoints = this.convertSeveritiesToDataPoints(severities);
        this.drawDataPoints(dataPoints);
        this.addInfoWindowEvents(severityParams)
    }

    clearRectangles() {
        this.rectangles.forEach((rectangle) => {
            rectangle.setMap(null);
        });
    }

    closeInfoWindow() {
        if (this.infoWindow) {
            this.infoWindow.close()
        }
    }

    async getSeverities(severityParams: SeverityParams): Promise<Severity[]> {
        return await new DatabaseClient().fetchSeverities(severityParams);
    }

    convertSeveritiesToDataPoints(severities: Severity[]): DataPoint[] {
        let dataPoints: DataPoint[] = [];
        severities.forEach((severity: Severity) => {
            let latLang = this.googleWrapper.latLng(severity.lat, severity.long);
            let dataPoint = new DataPoint(
                latLang.lat(),
                latLang.lng(),
                ColorHelper.color(severity.severity, 5),
                this.map
            );
            dataPoints.push(dataPoint);
        });
        return dataPoints;
    }

    drawDataPoints(dataPoints: DataPoint[]) {
        dataPoints.forEach((dataPoint: DataPoint) => {
            let rectangle = this.googleWrapper.createRectangle(dataPoint);
            this.rectangles.push(rectangle);
        });
    }

    addInfoWindowEvents(severityParams: SeverityParams) {
        this.rectangles.forEach((rectangle) => {
            rectangle.addListener("click", async (event) => {
                if (this.infoWindow) {
                    this.infoWindow.close();
                }
                this.infoWindow = this.googleWrapper.createInfoWindow({
                    content: infoWindowLoadingTemplate,
                    position: event.latLng,
                });
                this.infoWindow.open(this.map);
                const newContent = await this.fetchPointDetails(
                    event.latLng.lat(), 
                    event.latLng.lng(), 
                    severityParams)
                this.infoWindow.setContent(newContent);
            });
        })
    }

    private async fetchPointDetails(latitude, longitude, severityParams): Promise<string> {
        return new DatabaseClient().fetchPointDetails({
            latitude: latitude,
            longitude: longitude,
            start_date: severityParams.start_date,
            end_date: severityParams.end_date,
            pest_id: severityParams.pest_id,
        });
    }
}
