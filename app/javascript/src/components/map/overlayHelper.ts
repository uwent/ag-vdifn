import { SeverityParams, Severity } from '../common/TypeScript/types'
import DatabaseClient from '../common/TypeScript/databaseClient'
import GoogleWrapper from './TypeScript/googleWrapper'
import RectangleOption from './TypeScript/rectangleOption'
import infoWindowLoadingTemplate from './TypeScript/templates/infoWindowLoading'
import ColorHelper from './TypeScript/colorHelper'
import _ from 'lodash'

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
    if (this.severities.length > 0 && this.severities[0].min) {
      this.min = this.severities[0].min
      this.max = this.severities[0].max
    }
    const rectangleOptions = this.convertSeveritiesToRectangleOptions()
    this.drawDataPoints(rectangleOptions)
    this.addInfoWindowEvents(severityParams, panelType)
  }

  updateOverlayGradient(gradientMapping) {
    _.zip(this.severities, this.rectangles).forEach(
      (severityWithRect: [Severity, any]) => {
        severityWithRect[1].setOptions({
          fillColor: this.mapColorToSeverity(
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
    return await new DatabaseClient().fetchSeverities(severityParams)
  }

  convertSeveritiesToRectangleOptions(): RectangleOption[] {
    let rectangleOptions: RectangleOption[] = []
    this.severities.forEach((severity: Severity) => {
      let latLang = this.googleWrapper.latLng(severity.lat, severity.long)
      let rectangleOption = new RectangleOption(
        latLang.lat(),
        latLang.lng(),
        ColorHelper.color(severity.level, 5),
        this.map,
      )
      rectangleOptions.push(rectangleOption)
    })
    return rectangleOptions
  }

  drawDataPoints(rectangleOptions: RectangleOption[]) {
    rectangleOptions.forEach((rectangleOption) => {
      let rectangle = this.googleWrapper.createRectangle(rectangleOption)
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

  mapColorToSeverity(severityNumber: number, gradientMapping): string {
    const key = _.find(
      _.keys(gradientMapping)
        .map((value) => parseFloat(value))
        .sort(),
      (rangeMin) => severityNumber <= rangeMin,
    )
    if (key === undefined) {
      return gradientMapping[_.findLastKey(gradientMapping)]
    } else {
      return gradientMapping[key]
    }
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
