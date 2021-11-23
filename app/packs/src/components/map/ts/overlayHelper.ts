const _ = require('lodash')
import { SeverityParams, Severity } from '../../common/ts/types'
import DatabaseClient from '../../common/ts/databaseClient'
import GoogleWrapper from './googleWrapper'
import RectangleOption from './rectangleOption'
import infoWindowLoadingTemplate from './templates/infoWindowLoading'
import ColorHelper from './colorHelper'

export default class OverlayHelper {
  googleWrapper: GoogleWrapper
  rectangles: any
  infoWindow: any
  map
  severities: Severity[]
  min: number
  max: number
  severityParams: SeverityParams
  constructor(googleWrapper: GoogleWrapper, map: any) {
    this.googleWrapper = googleWrapper
    this.rectangles = []
    this.map = map
    this.severities = []
  }

  hideOverlay() {
    this.rectangles.forEach((rectangle) => {
      rectangle.setOptions({
        visible: false,
      })
    })
  }

  showOverlay() {
    this.rectangles.forEach((rectangle) => {
      rectangle.setOptions({
        visible: true,
      })
    })
  }

  async updateOverlay(severityParams: SeverityParams, panelType) {
    this.clearRectangles()
    this.closeInfoWindow()
    this.severities = await this.getSeverities(severityParams)
    if (this.severities.length > 0) {
      this.min = Math.min(...this.severities.map(point => point.level))
      this.max = Math.max(...this.severities.map(point => point.level))
    }
    const rectangleOptions = this.convertSeveritiesToRectangleOptions()
    this.drawDataPoints(rectangleOptions)
    this.addInfoWindowEvents(severityParams, panelType)
  }

  updateOverlayGradient(gradientMapping) {
    _.zip(this.severities, this.rectangles).forEach(
      (severityWithRect: [Severity, any]) => {
        severityWithRect[1].setOptions({
          fillColor: this.severityToColor(
            severityWithRect[0].level,
            gradientMapping,
          ),
        })
      },
    )
  }

  clearRectangles() {
    this.rectangles.forEach((rectangle) => {
      rectangle.setMap(null)
    })
    this.rectangles = []
  }

  closeInfoWindow() {
    if (this.infoWindow) {
      this.infoWindow.close()
    }
  }

  async getSeverities(severityParams: SeverityParams): Promise<Severity[]> {
    const severities = await new DatabaseClient().fetchSeverities(severityParams)
    return severities
  }

  convertSeveritiesToRectangleOptions(): RectangleOption[] {
    const rectangleOptions: RectangleOption[] = []
    this.severities.forEach((severity: Severity) => {
      const latLng = this.googleWrapper.latLng(severity.lat, severity.long)
      const rectangleOption = new RectangleOption(
        latLng.lat(),
        latLng.lng(),
        ColorHelper.color(severity.level, 5),
        this.map,
      )
      rectangleOptions.push(rectangleOption)
    })
    return rectangleOptions
  }

  drawDataPoints(rectangleOptions: RectangleOption[]) {
    rectangleOptions.forEach((rectangleOption) => {
      const rectangle = this.googleWrapper.createRectangle(rectangleOption)
      this.rectangles.push(rectangle)
    })
  }

  addInfoWindowEvents(severityParams: SeverityParams, panelType: string) {
    this.rectangles.forEach((rectangle) => {
      rectangle.addListener('click', async (event) => {
        if (this.infoWindow) {
          this.infoWindow.close()
        }
        this.infoWindow = this.googleWrapper.createInfoWindow({
          content: infoWindowLoadingTemplate,
          position: event.latLng,
        })
        this.infoWindow.open(this.map)
        const newContent = await this.fetchPointDetails(
          event.latLng.lat(),
          event.latLng.lng(),
          severityParams,
          panelType,
        )
        this.infoWindow.setContent(newContent)
      })
    })
  }

  severityToColor(severityNumber: number, gradientMapping): string {
    const key = _.find(
      _.keys(gradientMapping)
        .map((value) => parseFloat(value))
        .sort((x, y) => x - y),
      (rangeMax) => severityNumber <= rangeMax,
    )
    return gradientMapping[key]
  }

  private async fetchPointDetails(
    latitude,
    longitude,
    severityParams: SeverityParams,
    panelType,
  ): Promise<string> {
    return new DatabaseClient().fetchPointDetails({
      latitude: latitude,
      longitude: longitude,
      start_date: severityParams.start_date,
      end_date: severityParams.end_date,
      pest_id: severityParams.pest_id,
      t_min: severityParams.t_min,
      t_max: severityParams.t_max,
      in_fahrenheit: severityParams.in_fahrenheit,
      panel: panelType,
    })
  }
}
