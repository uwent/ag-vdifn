import type { SeverityParams, Severity, PanelType, GradientHash } from '@types';
import DatabaseClient from '@ts/databaseClient';
import GoogleWrapper from './googleWrapper';
import RectangleOption from './rectangleOption';
import tippy from 'tippy.js';

const loadingTemplate =
  '<div class="lds-ring" title="loading"><div></div><div></div><div></div><div></div></div>';

export default class OverlayHelper {
  googleWrapper: GoogleWrapper;
  rectangles;
  bounds;
  infoWindow;
  map;
  severities: Severity[];
  min?: number;
  max?: number;
  severityParams?: SeverityParams;

  constructor(googleWrapper: GoogleWrapper, map) {
    this.googleWrapper = googleWrapper;
    this.rectangles = [];
    this.map = map;
    this.severities = [];
  }

  showBounds(bounds) {
    if (this.bounds) this.bounds.setMap(null);
    this.bounds = this.googleWrapper.createBounds(bounds, this.map);
    this.map.fitBounds(bounds);
  }

  hideOverlay() {
    this.rectangles.forEach((rectangle) => {
      rectangle.setOptions({ visible: false });
    });
    if (this.bounds) this.bounds.setOptions({ visible: false });
  }

  showOverlay() {
    this.rectangles.forEach((rectangle) => {
      rectangle.setOptions({ visible: true });
    });
    if (this.bounds) this.bounds.setOptions({ visible: true });
  }

  async updateOverlay(panelType: PanelType, severityParams: SeverityParams) {
    this.clearRectangles();
    this.closeInfoWindow();

    this.severities = await this.getSeverities(severityParams);
    if (this.severities.length === 0) return;

    this.min = Math.min(...this.severities.map((point) => point.value));
    this.max = Math.max(...this.severities.map((point) => point.value));

    const rectangleOptions = this.buildRectangles();
    this.drawDataPoints(rectangleOptions);
    this.addInfoWindowEvents(severityParams, panelType);
  }

  updateOverlayGradient(gradient: GradientHash) {
    this.severities.forEach((severity, index) => {
      const rectangle = this.rectangles[index];
      if (!rectangle) return;
      rectangle.setOptions({
        fillColor: this.severityToColor(severity.value, gradient),
      });
    });
  }

  clearRectangles() {
    this.rectangles.forEach((rectangle) => {
      rectangle.setMap(null);
    });
    this.rectangles = [];
  }

  closeInfoWindow() {
    if (this.infoWindow) this.infoWindow.close();
  }

  async getSeverities(severityParams: SeverityParams): Promise<Severity[]> {
    const severities = await new DatabaseClient().fetchSeverities(severityParams);
    return severities;
  }

  buildRectangles(): RectangleOption[] {
    const rectangleOptions: RectangleOption[] = [];
    this.severities.forEach((severity: Severity) => {
      const latLng = this.googleWrapper.latLng(severity.lat, severity.lng);
      const rectangleOption = new RectangleOption(latLng.lat(), latLng.lng(), this.map);
      rectangleOptions.push(rectangleOption);
    });
    return rectangleOptions;
  }

  drawDataPoints(rectangleOptions: RectangleOption[]) {
    rectangleOptions.forEach((rectangleOption) => {
      const rectangle = this.googleWrapper.createRectangle(rectangleOption);
      this.rectangles.push(rectangle);
    });
  }

  addInfoWindowEvents(severityParams: SeverityParams, panelType: PanelType) {
    this.map.addListener('click', async () => {
      this.closeInfoWindow();
    });
    this.rectangles.forEach((rectangle) => {
      rectangle.addListener('click', async (event) => {
        this.closeInfoWindow();

        this.infoWindow = this.googleWrapper.createInfoWindow({
          content: loadingTemplate,
          position: event.latLng,
        });

        this.infoWindow.open(this.map);

        google.maps.event.addListener(this.infoWindow, 'domready', () => {
          // Initialize tippy on elements with tippy-tooltip class inside the infoWindow
          if (typeof tippy !== 'undefined') {
            tippy('.tippy-tooltip', {
              placement: 'top',
              arrow: true,
              theme: 'light-border',
              duration: 200,
            });
          }
        });

        const newContent = await this.fetchPointDetails(
          event.latLng.lat(),
          event.latLng.lng(),
          severityParams,
          panelType,
        );

        this.infoWindow.setContent(newContent);
      });
    });
  }

  severityToColor(severityNumber: number, gradient: GradientHash): string {
    const keys = Object.keys(gradient)
      .map(Number)
      .sort((x, y) => x - y);
    const key = keys.find((rangeMax) => severityNumber <= rangeMax);
    return key !== undefined ? gradient[key] : ''; // handle the case when key is undefined
  }

  private async fetchPointDetails(
    latitude: number,
    longitude: number,
    severityParams: SeverityParams,
    panelType: PanelType,
  ): Promise<string> {
    return new DatabaseClient().fetchPointDetails({
      latitude: latitude,
      longitude: longitude,
      start_date: severityParams.start_date,
      end_date: severityParams.end_date,
      pest_id: severityParams.pest_id,
      t_min: severityParams.t_min,
      t_max: severityParams.t_max,
      in_f: severityParams.in_f,
      panel: panelType,
    });
  }
}
