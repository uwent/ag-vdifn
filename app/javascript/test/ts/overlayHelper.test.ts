import DatabaseClient from '@ts/databaseClient';
import GoogleWrapper from '@components/map/ts/googleWrapper';
import ColorHelper from '@components/map/ts/colorHelper';
import RectangleOption from '@components/map/ts/rectangleOption';
import infoWindowLoadingTemplate from '@components/map/ts/infoWindowLoading';
import OverlayHelper from '@components/map/ts/overlayHelper';

vi.mock('@components/map/ts/googleWrapper');
vi.mock('@components/map/ts/rectangleOption');
vi.mock('@components/map/ts/colorHelper');

let overlayHelper;
const firstSeverity = { lat: 5, lng: 10, level: 10 };
const secondSeverity = { lat: 50, lng: 60, level: 5 };
const severityResults = [firstSeverity, secondSeverity];
const googleWrapper = new GoogleWrapper({});
const map = {};
const severityParams = {
  start_date: '2020-10-10',
  end_date: '2020-10-11',
  pest_id: 2,
};
const panelType = 'Disease';

beforeEach(() => {
  overlayHelper = new OverlayHelper(googleWrapper, map);
  overlayHelper.map.addListener = vi.fn();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('creates and updates overlay', () => {
  test('hides overlay', () => {
    const setOptionsSpy = vi.fn();
    overlayHelper.rectangles = [{ setOptions: setOptionsSpy }, { setOptions: setOptionsSpy }];
    overlayHelper.hideOverlay();
    expect(setOptionsSpy).toHaveBeenNthCalledWith(1, { visible: false });
    expect(setOptionsSpy).toHaveBeenNthCalledWith(2, { visible: false });
  });

  test('shows overlay', () => {
    const setOptionsSpy = vi.fn();
    overlayHelper.rectangles = [{ setOptions: setOptionsSpy }, { setOptions: setOptionsSpy }];
    overlayHelper.showOverlay();
    expect(setOptionsSpy).toHaveBeenNthCalledWith(1, { visible: true });
    expect(setOptionsSpy).toHaveBeenNthCalledWith(2, { visible: true });
  });

  test('updates overlay', async () => {
    const severities = [
      { lat: 5, lng: 10, severity: 10 },
      { lat: 50, lng: 60, severity: 5 },
    ];
    const panelType = 'Disease';
    const rectangleOptions = [{ data: 'data' }, { data: 'data2' }];
    overlayHelper.getSeverities = vi.fn().mockResolvedValue(severities);
    overlayHelper.severities = severities;
    overlayHelper.convertSeveritiesToRectangleOptions = vi.fn().mockReturnValue(rectangleOptions);
    overlayHelper.drawDataPoints = vi.fn().mockReturnValue('rectangle');
    vi.spyOn(OverlayHelper.prototype, 'clearRectangles');
    vi.spyOn(OverlayHelper.prototype, 'closeInfoWindow');
    vi.spyOn(OverlayHelper.prototype, 'getSeverities');
    vi.spyOn(OverlayHelper.prototype, 'convertSeveritiesToRectangleOptions');
    vi.spyOn(OverlayHelper.prototype, 'drawDataPoints');
    vi.spyOn(OverlayHelper.prototype, 'addInfoWindowEvents');

    await overlayHelper.updateOverlay(severityParams, panelType);

    expect(overlayHelper.clearRectangles).toHaveBeenCalled();
    expect(overlayHelper.closeInfoWindow).toHaveBeenCalled();
    expect(overlayHelper.getSeverities).toHaveBeenCalledWith(severityParams);
    expect(overlayHelper.convertSeveritiesToRectangleOptions).toHaveBeenCalled();
    expect(overlayHelper.drawDataPoints).toHaveBeenCalledWith(rectangleOptions);
    expect(overlayHelper.addInfoWindowEvents).toHaveBeenCalledWith(severityParams, panelType);
  });

  test('clears all rectangles', () => {
    const setMapMock = vi.fn();
    const rectMock = { setMap: setMapMock };
    overlayHelper.rectangles = [rectMock, rectMock, rectMock];
    overlayHelper.clearRectangles();
    expect(setMapMock).toHaveBeenCalledWith(null);
    expect(setMapMock).toHaveBeenCalledTimes(3);
  });

  test('closes info window', () => {
    const closeMock = vi.fn();
    const infoWindowMock = { close: closeMock };
    overlayHelper.infoWindow = infoWindowMock;
    overlayHelper.closeInfoWindow();
    expect(closeMock).toHaveBeenCalledOnce();
  });

  test('does not call close info window if it does not exist', () => {
    const closeMock = vi.fn();
    overlayHelper.closeInfoWindow();
    expect(closeMock).not.toHaveBeenCalled();
  });

  test('gets severities', async () => {
    const severities = await overlayHelper.getSeverities(severityParams);
    expect(severities).toEqual(severityResults);
  });
});

describe('convert severities to rectangleOptions', () => {
  test('calls google wrapper latLng', () => {
    const latMock = vi.fn().mockReturnValue(2);
    const lngMock = vi.fn().mockReturnValue(3);
    const latLngMock = vi.fn().mockImplementation((num, num2) => ({
      lat: latMock,
      lng: lngMock,
    }));
    googleWrapper.latLng = latLngMock;
    overlayHelper.severities = severityResults;
    overlayHelper.convertSeveritiesToRectangleOptions();
    expect(latLngMock).toHaveBeenNthCalledWith(1, firstSeverity.lat, firstSeverity.long);
    expect(latLngMock).toHaveBeenNthCalledWith(2, secondSeverity.lat, secondSeverity.long);
    expect(lngMock).toHaveBeenCalledTimes(2);
    expect(latMock).toHaveBeenCalledTimes(2);
  });

  test('calls color helper', () => {
    const spy = vi.spyOn(ColorHelper, 'color');
    overlayHelper.severities = severityResults;
    overlayHelper.convertSeveritiesToRectangleOptions();
    expect(spy).toHaveBeenNthCalledWith(1, firstSeverity.level, 5);
    expect(spy).toHaveBeenNthCalledWith(2, secondSeverity.level, 5);
  });

  test('creates rectangleOptions', () => {
    const colorSpy = vi.spyOn(ColorHelper, 'color');
    colorSpy.mockImplementationOnce(() => 'red');
    colorSpy.mockImplementationOnce(() => 'green');
    overlayHelper.severities = severityResults;
    overlayHelper.convertSeveritiesToRectangleOptions();
    expect(RectangleOption).toHaveBeenCalledTimes(2); // two rectangles in severityResults
    expect(RectangleOption).toHaveBeenNthCalledWith(1, 2, 3, 'red', map);
    expect(RectangleOption).toHaveBeenNthCalledWith(2, 2, 3, 'green', map);
  });
});

test('creates rectangles', () => {
  const RectangleOption = {};
  const dataPoint2 = {};
  const rectangleOptions = [RectangleOption, dataPoint2];
  overlayHelper.drawDataPoints(rectangleOptions);
  expect(googleWrapper.createRectangle).toHaveBeenCalledTimes(2);
  expect(overlayHelper.rectangles.length).toEqual(2);
});

describe('rectangle click listener event', () => {
  let rectMock;
  let eventMock;
  let latLngMock;
  let rectMock2;
  let infoWindowMock;

  beforeEach(() => {
    infoWindowMock = {
      open: vi.fn(),
      close: vi.fn(),
      setContent: vi.fn(),
    };
    latLngMock = {
      lat: vi.fn().mockReturnValue(1),
      lng: vi.fn().mockReturnValue(2),
    };
    eventMock = {
      latLng: latLngMock,
    };
    rectMock = {
      addListener: vi.fn((_eventName, callback) => callback(eventMock)),
    };
    rectMock2 = {
      addListener: vi.fn((_eventName, callback) => callback(eventMock)),
    };
    googleWrapper.createInfoWindow = vi.fn(() => infoWindowMock);
  });

  test('closes infowindow if it exists', () => {
    const closeMock = vi.fn();
    const infoWindowMock = { close: closeMock };
    overlayHelper.rectangles = [rectMock, rectMock2];
    overlayHelper.infoWindow = infoWindowMock;
    overlayHelper.addInfoWindowEvents(severityParams, panelType);
    expect(closeMock).toHaveBeenCalled();
  });

  test('it creates an infoWindow', () => {
    const createInfoWindowSpy = vi.fn(() => infoWindowMock);
    googleWrapper.createInfoWindow = createInfoWindowSpy;
    overlayHelper.rectangles = [rectMock, rectMock2];
    overlayHelper.addInfoWindowEvents(severityParams, panelType);
    expect(createInfoWindowSpy).toHaveBeenNthCalledWith(1, {
      content: infoWindowLoadingTemplate,
      position: latLngMock,
    });
    expect(createInfoWindowSpy).toHaveBeenNthCalledWith(2, {
      content: infoWindowLoadingTemplate,
      position: latLngMock,
    });
  });

  test('opens the infowindow on the map', () => {
    const openMock = vi.fn(() => {});
    infoWindowMock = { ...infoWindowMock, open: openMock };
    overlayHelper.rectangles = [rectMock, rectMock2];
    googleWrapper.createInfoWindow = vi.fn(() => infoWindowMock);
    overlayHelper.addInfoWindowEvents(severityParams, panelType);
    expect(openMock).toHaveBeenCalledTimes(2);
  });

  test('fetches point details', () => {
    const spy = vi.spyOn(DatabaseClient.prototype, 'fetchPointDetails');
    overlayHelper.rectangles = [rectMock, rectMock2];
    overlayHelper.addInfoWindowEvents(severityParams, panelType);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith({
      latitude: 1,
      longitude: 2,
      start_date: severityParams.start_date,
      end_date: severityParams.end_date,
      pest_id: severityParams.pest_id,
      panel: panelType,
    });
  });

  test('sets the content on the infoWindow', async () => {
    const setContentMock = vi.fn().mockImplementation((newContent) => {});
    infoWindowMock = { ...infoWindowMock, setContent: setContentMock };
    overlayHelper.fetchPointDetails = vi.fn(() => 'newContent');
    overlayHelper.rectangles = [rectMock, rectMock2];

    await overlayHelper.addInfoWindowEvents(severityParams, panelType);

    expect(setContentMock).toHaveBeenCalledTimes(2);
    expect(setContentMock).toHaveBeenCalledWith('newContent');
  });
});

test('maps gradient to severity values', () => {
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
    Infinity: '#00cc00',
  };

  expect(overlayHelper.severityToColor(50, gradientMapping)).toEqual('#00cc00');
  expect(overlayHelper.severityToColor(125, gradientMapping)).toEqual('#ffd700');
  expect(overlayHelper.severityToColor(175, gradientMapping)).toEqual('#ee8f00');
  expect(overlayHelper.severityToColor(800, gradientMapping)).toEqual('#00cc00');
});
