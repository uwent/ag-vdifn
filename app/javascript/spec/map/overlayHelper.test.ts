import GoogleWrapper from '../../src/components/map/ts/googleWrapper'
import ColorHelper from '../../src/components/map/ts/colorHelper'
import RectangleOption from '../../src/components/map/ts/rectangleOption'
import infoWindowLoadingTemplate from '../../src/components/map/ts/templates/infoWindowLoading'
import DatabaseClient from '../../src/components/common/ts/databaseClient'
import OverlayHelper from '../../src/components/map/ts/overlayHelper'

jest.mock('../../src/components/map/ts/googleWrapper')
jest.mock('../../src/components/map/ts/rectangleOption')
jest.mock('../../src/components/map/ts/colorHelper')

let overlayHelper
const firstSeverity = { lat: 5, long: 10, level: 10 }
const secondSeverity = { lat: 50, long: 60, level: 5 }
const severityResults = [firstSeverity, secondSeverity]
const googleWrapper = new GoogleWrapper({})
const map = {}
const severityParams = {
  start_date: '2020-10-10',
  end_date: '2020-10-11',
  pest_id: 2
}
const panelType = 'Disease'

beforeEach(() => {
  overlayHelper = new OverlayHelper(googleWrapper, map)
  overlayHelper.map.addListener = jest.fn()
})

afterEach(jest.clearAllMocks)

describe('creates and updates overlay', () => {
  it('hides overlay', () => {
    const setOptionsSpy = jest.fn()
    overlayHelper.rectangles = [
      { setOptions: setOptionsSpy },
      { setOptions: setOptionsSpy }
    ]
    overlayHelper.hideOverlay()
    expect(setOptionsSpy).toHaveBeenNthCalledWith(1, { visible: false })
    expect(setOptionsSpy).toHaveBeenNthCalledWith(2, { visible: false })
  })

  it('shows overlay', () => {
    const setOptionsSpy = jest.fn()
    overlayHelper.rectangles = [
      { setOptions: setOptionsSpy },
      { setOptions: setOptionsSpy }
    ]
    overlayHelper.showOverlay()
    expect(setOptionsSpy).toHaveBeenNthCalledWith(1, { visible: true })
    expect(setOptionsSpy).toHaveBeenNthCalledWith(2, { visible: true })
  })

  it('updates overlay', async () => {
    const severities = [
      { lat: 5, long: 10, severity: 10 },
      { lat: 50, long: 60, severity: 5 }
    ]
    const panelType = 'Disease'
    const rectangleOptions = [{ data: 'data' }, { data: 'data2' }]
    overlayHelper.getSeverities = jest.fn().mockResolvedValue(severities)
    overlayHelper.severities = severities
    overlayHelper.convertSeveritiesToRectangleOptions = jest.fn().mockReturnValue(rectangleOptions)
    overlayHelper.drawDataPoints = jest.fn().mockReturnValue('rectangle')
    jest.spyOn(OverlayHelper.prototype, 'clearRectangles')
    jest.spyOn(OverlayHelper.prototype, 'closeInfoWindow')
    jest.spyOn(OverlayHelper.prototype, 'getSeverities')
    jest.spyOn(OverlayHelper.prototype, 'convertSeveritiesToRectangleOptions')
    jest.spyOn(OverlayHelper.prototype, 'drawDataPoints')
    jest.spyOn(OverlayHelper.prototype, 'addInfoWindowEvents')

    await overlayHelper.updateOverlay(severityParams, panelType)

    expect(overlayHelper.clearRectangles).toHaveBeenCalled()
    expect(overlayHelper.closeInfoWindow).toHaveBeenCalled()
    expect(overlayHelper.getSeverities).toHaveBeenCalledWith(severityParams)
    expect(overlayHelper.convertSeveritiesToRectangleOptions).toHaveBeenCalled()
    expect(overlayHelper.drawDataPoints).toHaveBeenCalledWith(rectangleOptions)
    expect(overlayHelper.addInfoWindowEvents).toHaveBeenCalledWith(
      severityParams,
      panelType
    )
  })

  it('clears all rectangles', () => {
    const setMapMock = jest.fn()
    const rectMock = { setMap: setMapMock }
    overlayHelper.rectangles = [rectMock, rectMock, rectMock]
    overlayHelper.clearRectangles()
    expect(setMapMock).toHaveBeenCalledWith(null)
    expect(setMapMock).toHaveBeenCalledTimes(3)
  })

  it('closes info window', () => {
    const closeMock = jest.fn()
    const infoWindowMock = { close: closeMock }
    overlayHelper.infoWindow = infoWindowMock
    overlayHelper.closeInfoWindow()
    expect(closeMock).toHaveBeenCalled()
  })

  it('does not call close info window if it does not exist', () => {
    const closeMock = jest.fn()
    overlayHelper.closeInfoWindow()
    expect(closeMock).not.toHaveBeenCalled()
  })

  it('gets severities', async () => {
    const severities = await overlayHelper.getSeverities(severityParams)
    expect(severities).toEqual(severityResults)
  })
})

describe('convert severities to rectangleOptions', () => {
  it('calls google wrapper latLng', () => {
    const latMock = jest.fn().mockReturnValue(2)
    const lngMock = jest.fn().mockReturnValue(3)
    const latLngMock = jest.fn().mockImplementation((num, num2) => ({
      lat: latMock,
      lng: lngMock
    }))
    googleWrapper.latLng = latLngMock
    overlayHelper.severities = severityResults
    overlayHelper.convertSeveritiesToRectangleOptions()
    expect(latLngMock).toHaveBeenNthCalledWith(1, firstSeverity.lat, firstSeverity.long)
    expect(latLngMock).toHaveBeenNthCalledWith(2, secondSeverity.lat, secondSeverity.long)
    expect(lngMock).toHaveBeenCalledTimes(2)
    expect(latMock).toHaveBeenCalledTimes(2)
  })

  it('calls color helper', () => {
    const spy = jest.spyOn(ColorHelper, 'color')
    overlayHelper.severities = severityResults
    overlayHelper.convertSeveritiesToRectangleOptions()
    expect(spy).toHaveBeenNthCalledWith(1, firstSeverity.level, 5)
    expect(spy).toHaveBeenNthCalledWith(2, secondSeverity.level, 5)
  })

  it('creates rectangleOptions', () => {
    ColorHelper.color = jest.fn().mockReturnValue('#cc0000')
    overlayHelper.severities = severityResults
    overlayHelper.convertSeveritiesToRectangleOptions()
    expect(RectangleOption).toHaveBeenNthCalledWith(1, 2, 3, '#cc0000', map)
  })
})

it('creates rectangles', () => {
  const RectangleOption = {}
  const dataPoint2 = {}
  const rectangleOptions = [RectangleOption, dataPoint2]
  overlayHelper.drawDataPoints(rectangleOptions)
  expect(googleWrapper.createRectangle).toHaveBeenCalledTimes(2)
  expect(overlayHelper.rectangles.length).toEqual(2)
})

describe('rectangle click listener event', () => {
  let rectMock
  let eventMock
  let latLngMock
  let rectMock2
  let infoWindowMock

  beforeEach(() => {
    infoWindowMock = {
      open: jest.fn(),
      close: jest.fn(),
      setContent: jest.fn()
    }
    latLngMock = {
      lat: jest.fn().mockReturnValue(1),
      lng: jest.fn().mockReturnValue(2)
    }
    eventMock = {
      latLng: latLngMock
    }
    rectMock = {
      addListener: jest
        .fn()
        .mockImplementation((_eventName, callback) => callback(eventMock))
    }
    rectMock2 = {
      addListener: jest
        .fn()
        .mockImplementation((_eventName, callback) => callback(eventMock))
    }
    ;(googleWrapper.createInfoWindow as jest.Mock).mockImplementation(
      (content, position) => infoWindowMock
    )
  })

  it('closes infowindow if it exists', () => {
    const closeMock = jest.fn()
    const infoWindowMock = { close: closeMock }
    overlayHelper.rectangles = [rectMock, rectMock2]
    overlayHelper.infoWindow = infoWindowMock
    overlayHelper.addInfoWindowEvents(severityParams, panelType)
    expect(closeMock).toHaveBeenCalled()
  })

  it('it creates an infoWindow', () => {
    const createInfoWindowSpy = jest
      .fn()
      .mockImplementation((content, position) => infoWindowMock)
    googleWrapper.createInfoWindow = createInfoWindowSpy
    overlayHelper.rectangles = [rectMock, rectMock2]
    overlayHelper.addInfoWindowEvents(severityParams, panelType)
    expect(createInfoWindowSpy).toHaveBeenNthCalledWith(1, {
      content: infoWindowLoadingTemplate,
      position: latLngMock
    })
    expect(createInfoWindowSpy).toHaveBeenNthCalledWith(2, {
      content: infoWindowLoadingTemplate,
      position: latLngMock
    })
  })

  it('opens the infowindow on the map', () => {
    const openMock = jest.fn().mockImplementation(map => {})
    infoWindowMock = { ...infoWindowMock, open: openMock }
    overlayHelper.rectangles = [rectMock, rectMock2]
    ;(googleWrapper.createInfoWindow as jest.Mock).mockImplementation(
      (content, position) => infoWindowMock
    )
    overlayHelper.addInfoWindowEvents(severityParams, panelType)
    expect(openMock).toHaveBeenCalledTimes(2)
  })

  it('fetches point details', () => {
    const spy = jest.spyOn(DatabaseClient.prototype, 'fetchPointDetails')
    overlayHelper.rectangles = [rectMock, rectMock2]
    overlayHelper.addInfoWindowEvents(severityParams, panelType)
    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy).toHaveBeenCalledWith({
      latitude: 1,
      longitude: 2,
      start_date: severityParams.start_date,
      end_date: severityParams.end_date,
      pest_id: severityParams.pest_id,
      panel: panelType
    })
  })

  it('sets the content on the infoWindow', async () => {
    const setContentMock = jest.fn().mockImplementation(newContent => {})
    infoWindowMock = { ...infoWindowMock, setContent: setContentMock }
    overlayHelper.fetchPointDetails = jest
      .fn()
      .mockImplementation((lat, long, severityParams, panelType) => 'newContent')
    overlayHelper.rectangles = [rectMock, rectMock2]

    await overlayHelper.addInfoWindowEvents(severityParams, panelType)

    expect(setContentMock).toHaveBeenCalledTimes(2)
    expect(setContentMock).toHaveBeenCalledWith('newContent')
  })
})

it('maps gradient to severity values', () => {
  const gradientMapping = {
    100: '#00cc00',
    110: '#55d000',
    120: '#aad300',
    130: '#ffd700',
    140: '#ee8f00',
    150: '#dd4800',
    160: '#cc0000',
    170: '#dd4800',
    180: '#ee8f00',
    190: '#ffd700',
    200: '#aad300',
    210: '#55d000',
    Infinity: '#00cc00'
  }

  expect(overlayHelper.severityToColor(50, gradientMapping)).toEqual('#00cc00')
  expect(overlayHelper.severityToColor(125, gradientMapping)).toEqual('#ffd700')
  expect(overlayHelper.severityToColor(175, gradientMapping)).toEqual('#ee8f00')
  expect(overlayHelper.severityToColor(800, gradientMapping)).toEqual('#00cc00')
})
