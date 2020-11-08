import GoogleWrapper from '../../src/components/map/TypeScript/googleWrapper';
import ColorHelper from '../../src/components/map/TypeScript/colorHelper';
import RectangleOption from '../../src/components/map/TypeScript/rectangleOption';
import infoWindowLoadingTemplate from '../../src/components/map/TypeScript/templates/infoWindowLoading';
import DatabaseClient from '../../src/components/common/TypeScript/databaseClient';
import OverlayHelper from '../../src/components/map/overlayHelper';
jest.mock('../../src/components/map/TypeScript/googleWrapper')
jest.mock('../../src/components/map/TypeScript/rectangleOption')
jest.mock('../../src/components/map/TypeScript/colorHelper')
let overlayHelper;
let firstSeverity = { "lat": 5, "long": 10, "level": 10 }
let secondSeverity = { "lat": 50, "long": 60, "level": 5 }
let severityResults = [firstSeverity, secondSeverity];
let googleWrapper = new GoogleWrapper({})
let map = {}
let severityParams = { start_date: "2020-10-10", end_date: "2020-10-11", pest_id: 2 }
beforeEach(() => {
    overlayHelper = new OverlayHelper(googleWrapper, map)
})
afterEach(jest.clearAllMocks)

it('hides overlay', () => {
    const setOptionsSpy = jest.fn()
    overlayHelper.rectangles = [{setOptions: setOptionsSpy}, {setOptions: setOptionsSpy}]

    overlayHelper.hideOverlay();

    expect(setOptionsSpy).toHaveBeenNthCalledWith(1, {visible: false})
    expect(setOptionsSpy).toHaveBeenNthCalledWith(2, {visible: false})
})

it('shows overlay', () => {
    const setOptionsSpy = jest.fn()
    overlayHelper.rectangles = [{setOptions: setOptionsSpy}, {setOptions: setOptionsSpy}]

    overlayHelper.showOverlay();

    expect(setOptionsSpy).toHaveBeenNthCalledWith(1, {visible: true})
    expect(setOptionsSpy).toHaveBeenNthCalledWith(2, {visible: true}) 
})

it('clears all rectangles', () => {
    const setMapMock = jest.fn();
    const rectMock = {
        setMap: setMapMock
    }
    overlayHelper.rectangles = [rectMock, rectMock, rectMock]

    overlayHelper.clearRectangles()

    expect(setMapMock).toHaveBeenCalledWith(null)
    expect(setMapMock).toHaveBeenCalledTimes(3)
})

it('closes info window', () => {
    const closeMock = jest.fn();
    const infoWindowMock = {
        close: closeMock
    }
    overlayHelper.infoWindow = infoWindowMock

    overlayHelper.closeInfoWindow()

    expect(closeMock).toHaveBeenCalled()
})

it('does not call close info window if it does not exist', () => {
    const closeMock = jest.fn();

    overlayHelper.closeInfoWindow()

    expect(closeMock).not.toHaveBeenCalled()
})

it('gets severities', async () => {
    const severities = await overlayHelper.getSeverities(severityParams)
    expect(severities).toEqual(severityResults)
})

describe("convert severities to rectangleOptions", () => {
    it('calls google wrapper latLng', () => {
        const latMock = jest.fn().mockReturnValue(2);
        const lngMock = jest.fn().mockReturnValue(3);
        const latLngMock = jest.fn().mockImplementation((num, num2) => ({
            lat: latMock,
            lng: lngMock
        }))
        googleWrapper.latLng = latLngMock;
        overlayHelper.severities = severityResults 

        overlayHelper.convertSeveritiesToRectangleOptions();

        expect(latLngMock).toHaveBeenNthCalledWith(1, firstSeverity.lat, firstSeverity.long)
        expect(latLngMock).toHaveBeenNthCalledWith(2, secondSeverity.lat, secondSeverity.long)
        expect(lngMock).toHaveBeenCalledTimes(2)
        expect(latMock).toHaveBeenCalledTimes(2)
    })

    it('calls color helper', () => {
        const spy = spyOn(ColorHelper, "color")
        overlayHelper.severities = severityResults
        overlayHelper.convertSeveritiesToRectangleOptions()

        expect(spy).toHaveBeenNthCalledWith(1, firstSeverity.level, 5)
        expect(spy).toHaveBeenNthCalledWith(2, secondSeverity.level, 5)
    })

    it('creates rectangleOptions', () => {
        ColorHelper.color = jest.fn().mockReturnValue("#cc0000")
        overlayHelper.severities = severityResults
        overlayHelper.convertSeveritiesToRectangleOptions()

        expect(RectangleOption).toHaveBeenNthCalledWith(
            1,
            2,
            3,
            "#cc0000",
            map
        )
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

describe("rectangle click listener event", () => {
    let rectMock;
    let eventMock;
    let latLngMock;
    let rectMock2;
    let infoWindowMock;
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
            addListener: jest.fn().mockImplementation((_eventName, callback) => callback(eventMock))
        };
        rectMock2 = {
            addListener: jest.fn().mockImplementation((_eventName, callback) => callback(eventMock))
        };
        (googleWrapper.createInfoWindow as jest.Mock).mockImplementation((content, position) => (infoWindowMock))
    })
    it('closes infowindow if it exists', () => {
        const closeMock = jest.fn();
        const infoWindowMock = {
            close: closeMock
        }
        overlayHelper.rectangles = [rectMock, rectMock2]
        overlayHelper.infoWindow = infoWindowMock

        overlayHelper.addInfoWindowEvents(severityParams)

        expect(closeMock).toHaveBeenCalled()
    })

    it("it creates an infoWindow", () => {
        const createInfoWindowSpy = jest.fn().mockImplementation((content, position) => infoWindowMock);
        googleWrapper.createInfoWindow = createInfoWindowSpy

        overlayHelper.rectangles = [rectMock, rectMock2]

        overlayHelper.addInfoWindowEvents(severityParams)

        expect(createInfoWindowSpy).toHaveBeenNthCalledWith(1, { content: infoWindowLoadingTemplate, position: latLngMock })
        expect(createInfoWindowSpy).toHaveBeenNthCalledWith(2, { content: infoWindowLoadingTemplate, position: latLngMock })

    })

    it('opens the infowindow on the map', () => {
        const openMock = jest.fn().mockImplementation((map) => { });
        infoWindowMock = { ...infoWindowMock, open: openMock };
        overlayHelper.rectangles = [rectMock, rectMock2];
        (googleWrapper.createInfoWindow as jest.Mock).mockImplementation((content, position) => (infoWindowMock))

        overlayHelper.addInfoWindowEvents(severityParams)

        expect(openMock).toHaveBeenCalledTimes(2)
    })

    it('fetches point details', () => {
        const spy = spyOn(DatabaseClient.prototype, 'fetchPointDetails');
        overlayHelper.rectangles = [rectMock, rectMock2]

        overlayHelper.addInfoWindowEvents(severityParams)

        expect(spy).toHaveBeenCalledTimes(2)
        expect(spy).toHaveBeenCalledWith({
            latitude: 1,
            longitude: 2,
            start_date: severityParams.start_date,
            end_date: severityParams.end_date,
            pest_id: severityParams.pest_id,
        })
    })

    it('sets the content on the infoWindow', async () => {
        const setContentMock = jest.fn().mockImplementation((newContent) => {});
        infoWindowMock = { ...infoWindowMock, setContent: setContentMock };
        overlayHelper.fetchPointDetails = jest.fn().mockImplementation((lat, long, severityParams) => "newContent")
        overlayHelper.rectangles = [rectMock, rectMock2];

        await overlayHelper.addInfoWindowEvents(severityParams);

        expect(setContentMock).toHaveBeenCalledTimes(2);
        expect(setContentMock).toHaveBeenCalledWith("newContent");
    })
})

it('updates overlay', async () => {
    const severities = [{ "lat": 5, "long": 10, "severity": 10 },
    { "lat": 50, "long": 60, "severity": 5 }]
    const rectangleOptions = [{ data: "data"}, {data: "data2"}]
    overlayHelper.getSeverities = jest.fn().mockResolvedValue(severities)
    overlayHelper.severities = severities
    overlayHelper.convertSeveritiesToRectangleOptions = jest.fn().mockReturnValue(rectangleOptions)
    spyOn(OverlayHelper.prototype, 'clearRectangles')
    spyOn(OverlayHelper.prototype, 'closeInfoWindow')
    spyOn(OverlayHelper.prototype, "getSeverities")
    spyOn(OverlayHelper.prototype, 'convertSeveritiesToRectangleOptions')
    spyOn(OverlayHelper.prototype, "drawDataPoints")
    spyOn(OverlayHelper.prototype, "addInfoWindowEvents")

    await overlayHelper.updateOverlay(severityParams);

    expect(overlayHelper.clearRectangles).toHaveBeenCalled();
    expect(overlayHelper.closeInfoWindow).toHaveBeenCalled();
    expect(overlayHelper.getSeverities).toHaveBeenCalledWith(severityParams);
    expect(overlayHelper.convertSeveritiesToRectangleOptions).toHaveBeenCalled();
    expect(overlayHelper.drawDataPoints).toHaveBeenCalledWith(rectangleOptions)
    expect(overlayHelper.addInfoWindowEvents).toHaveBeenCalledWith(severityParams)
})

it('maps gradient to severity values', () => {
    const gradientMapping = {
        "435": "#00cc00",
        "463.4": "#55d000",
        "491.8": "#aad300",
        "520.2": "#ffd700",
        "548.6": "#ee8f00",
        "577": "#dd4800",
        "597": "#cc0000",
        "624.6": "#dd4800",
        "652.2": "#ee8f00",
        "679.8": "#ffd700",
        "707.4": "#aad300",
        "735": "#55d000",
        "749.19": "#00cc00",
    }

    let result = overlayHelper.mapColorToSeverity(506.47, gradientMapping)

    expect(result).toEqual("#ffd700")

    result = overlayHelper.mapColorToSeverity(800, gradientMapping)

    expect(result).toEqual("#00cc00")
})