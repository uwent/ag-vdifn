// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from 'vitest';
import OverlayHelper from '@ts/overlayHelper';
import DatabaseClient from '@ts/databaseClient';
import RectangleOption from '@ts/rectangleOption';
import type { SeverityParams } from '@types';

const selectedPanel = 'disease';

// Mock dependencies
vi.mock('@ts/databaseClient', () => ({
  default: vi.fn().mockImplementation(() => ({
    fetchSeverities: vi.fn(),
    fetchPointDetails: vi.fn(),
  })),
}));

vi.mock('@ts/googleWrapper');
vi.mock('@ts/rectangleOption', () => ({
  default: vi.fn().mockImplementation((lat, lng, map) => ({
    bounds: {},
    fillColor: '#FF0000',
    strokeColor: '#000000',
    strokeWeight: 1,
    fillOpacity: 0.5,
    map: map,
  })),
}));

vi.mock('tippy.js', () => ({
  default: vi.fn(),
}));

describe('OverlayHelper', () => {
  let overlayHelper: OverlayHelper;
  let mockGoogleWrapper: any;
  let mockMap: any;
  let mockRectangle: any;
  let mockBounds: any;
  let mockInfoWindow: any;
  let mockLatLng: any;
  let mockDatabaseClient: any;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Set up mock objects
    mockRectangle = {
      setOptions: vi.fn(),
      setMap: vi.fn(),
      addListener: vi.fn(),
    };

    mockBounds = {
      setMap: vi.fn(),
      setOptions: vi.fn(),
    };

    mockInfoWindow = {
      close: vi.fn(),
      open: vi.fn(),
      setContent: vi.fn(),
    };

    mockLatLng = {
      lat: () => 35.123,
      lng: () => -118.456,
    };

    mockMap = {
      fitBounds: vi.fn(),
      addListener: vi.fn((event, callback) => {
        if (event === 'click') {
          callback();
        }
        return { remove: vi.fn() };
      }),
    };

    // Mock Google global object
    global.google = {
      maps: {
        event: {
          addListener: vi.fn((obj, event, callback) => {
            if (event === 'domready') {
              callback();
            }
            return { remove: vi.fn() };
          }),
        },
      },
    } as any;

    // Set up mock GoogleWrapper
    mockGoogleWrapper = {
      createBounds: vi.fn().mockReturnValue(mockBounds),
      latLng: vi.fn().mockReturnValue(mockLatLng),
      createRectangle: vi.fn().mockReturnValue(mockRectangle),
      createInfoWindow: vi.fn().mockReturnValue(mockInfoWindow),
    };

    // Set up mock DatabaseClient
    mockDatabaseClient = {
      fetchSeverities: vi.fn(),
      fetchPointDetails: vi.fn(),
    };

    // Mock the DatabaseClient constructor
    vi.mocked(DatabaseClient).mockImplementation(() => mockDatabaseClient);

    // RectangleOption is already mocked in vi.mock('./rectangleOption', ...)

    // Create instance for testing
    overlayHelper = new OverlayHelper(mockGoogleWrapper, mockMap);
  });

  describe('initialization', () => {
    it('should initialize with correct properties', () => {
      expect(overlayHelper.googleWrapper).toBe(mockGoogleWrapper);
      expect(overlayHelper.map).toBe(mockMap);
      expect(overlayHelper.rectangles).toEqual([]);
      expect(overlayHelper.severities).toEqual([]);
    });
  });

  describe('bounds management', () => {
    it('should show bounds on the map', () => {
      const testBounds = { north: 36, south: 34, east: -117, west: -119 };

      overlayHelper.showBounds(testBounds);

      expect(mockGoogleWrapper.createBounds).toHaveBeenCalledWith(testBounds, mockMap);
      expect(mockMap.fitBounds).toHaveBeenCalledWith(testBounds);
      expect(overlayHelper.bounds).toBe(mockBounds);
    });

    it('should remove existing bounds before creating new ones', () => {
      // Setup with existing bounds
      overlayHelper.bounds = mockBounds;

      const testBounds = { north: 36, south: 34, east: -117, west: -119 };

      overlayHelper.showBounds(testBounds);

      expect(mockBounds.setMap).toHaveBeenCalledWith(null);
      expect(mockGoogleWrapper.createBounds).toHaveBeenCalledWith(testBounds, mockMap);
    });

    it('should hide overlay elements', () => {
      // Setup
      overlayHelper.rectangles = [mockRectangle, mockRectangle];
      overlayHelper.bounds = mockBounds;

      overlayHelper.hideOverlay();

      expect(mockRectangle.setOptions).toHaveBeenCalledTimes(2);
      expect(mockRectangle.setOptions).toHaveBeenCalledWith({ visible: false });
      expect(mockBounds.setOptions).toHaveBeenCalledWith({ visible: false });
    });

    it('should show overlay elements', () => {
      // Setup
      overlayHelper.rectangles = [mockRectangle, mockRectangle];
      overlayHelper.bounds = mockBounds;

      overlayHelper.showOverlay();

      expect(mockRectangle.setOptions).toHaveBeenCalledTimes(2);
      expect(mockRectangle.setOptions).toHaveBeenCalledWith({ visible: true });
      expect(mockBounds.setOptions).toHaveBeenCalledWith({ visible: true });
    });
  });

  describe('overlay update', () => {
    it('should clear existing rectangles and close info window before updating', async () => {
      // Setup
      overlayHelper.rectangles = [mockRectangle];
      overlayHelper.infoWindow = mockInfoWindow;
      mockDatabaseClient.fetchSeverities.mockResolvedValue([]);

      await overlayHelper.updateOverlay(selectedPanel, {} as SeverityParams);

      expect(mockRectangle.setMap).toHaveBeenCalledWith(null);
      expect(mockInfoWindow.close).toHaveBeenCalled();
    });

    it('should fetch severities and update min/max values', async () => {
      // Mock data
      const mockSeverities = [
        { lat: 35.1, lng: -118.4, value: 10 },
        { lat: 35.2, lng: -118.5, value: 20 },
        { lat: 35.3, lng: -118.6, value: 15 },
      ];

      mockDatabaseClient.fetchSeverities.mockResolvedValue(mockSeverities);

      const severityParams = {
        start_date: '2023-01-01',
        end_date: '2023-12-31',
        pest_id: 1,
        t_min: 50,
        t_max: 90,
        in_f: true,
      };

      // Call method
      await overlayHelper.updateOverlay(selectedPanel, severityParams);

      // Verify behavior
      expect(mockDatabaseClient.fetchSeverities).toHaveBeenCalledWith(severityParams);
      expect(overlayHelper.min).toBe(10);
      expect(overlayHelper.max).toBe(20);
      expect(overlayHelper.severities).toEqual(mockSeverities);
    });

    it('should create rectangles for each severity point', async () => {
      // Mock data
      const mockSeverities = [
        { lat: 35.1, lng: -118.4, value: 10 },
        { lat: 35.2, lng: -118.5, value: 20 },
      ];

      mockDatabaseClient.fetchSeverities.mockResolvedValue(mockSeverities);

      // Call method
      await overlayHelper.updateOverlay(selectedPanel, {} as SeverityParams);

      // Verify rectangles were created
      expect(mockGoogleWrapper.latLng).toHaveBeenCalledTimes(2);
      expect(mockGoogleWrapper.latLng).toHaveBeenCalledWith(35.1, -118.4);
      expect(mockGoogleWrapper.latLng).toHaveBeenCalledWith(35.2, -118.5);

      expect(RectangleOption).toHaveBeenCalledTimes(2);
      expect(RectangleOption).toHaveBeenCalledWith(35.123, -118.456, mockMap);

      expect(mockGoogleWrapper.createRectangle).toHaveBeenCalledTimes(2);
      expect(overlayHelper.rectangles.length).toBe(2);
    });

    it('should not create rectangles when no severities are returned', async () => {
      mockDatabaseClient.fetchSeverities.mockResolvedValue([]);

      await overlayHelper.updateOverlay(selectedPanel, {} as SeverityParams);

      expect(mockGoogleWrapper.createRectangle).not.toHaveBeenCalled();
      expect(overlayHelper.rectangles.length).toBe(0);
    });

    it('should update rectangle colors based on gradient', () => {
      // Setup
      overlayHelper.severities = [{ value: 5 } as any, { value: 15 } as any, { value: 25 } as any];

      overlayHelper.rectangles = [mockRectangle, mockRectangle, mockRectangle];

      const gradient = {
        10: '#0000FF',
        20: '#00FF00',
        30: '#FF0000',
      };

      // Call method
      overlayHelper.updateOverlayGradient(gradient);

      // Verify behavior
      expect(mockRectangle.setOptions).toHaveBeenCalledTimes(3);
      expect(mockRectangle.setOptions).toHaveBeenNthCalledWith(1, { fillColor: '#0000FF' });
      expect(mockRectangle.setOptions).toHaveBeenNthCalledWith(2, { fillColor: '#00FF00' });
      expect(mockRectangle.setOptions).toHaveBeenNthCalledWith(3, { fillColor: '#FF0000' });
    });
  });

  describe('info window management', () => {
    it('should close info window if it exists', () => {
      overlayHelper.infoWindow = mockInfoWindow;

      overlayHelper.closeInfoWindow();

      expect(mockInfoWindow.close).toHaveBeenCalled();
    });

    it('should handle case when no info window exists', () => {
      overlayHelper.infoWindow = null;

      // This should not throw an error
      expect(() => overlayHelper.closeInfoWindow()).not.toThrow();
    });

    it('should add click listener to map to close info window', () => {
      overlayHelper.addInfoWindowEvents(selectedPanel, {} as SeverityParams);

      // Verify map click listener was added
      expect(mockMap.addListener).toHaveBeenCalledWith('click', expect.any(Function));
    });

    it('should handle rectangle clicks and fetch point details', async () => {
      // Setup
      overlayHelper.rectangles = [mockRectangle];

      const mockPointDetails = '<div>Test Content</div>';
      mockDatabaseClient.fetchPointDetails.mockResolvedValue(mockPointDetails);

      const eventMock = {
        latLng: {
          lat: () => 35.123,
          lng: () => -118.456,
        },
      };

      // Mock the rectangle click listener to call the callback
      mockRectangle.addListener.mockImplementation((event: any, callback: any) => {
        if (event === 'click') {
          callback(eventMock);
        }
        return { remove: vi.fn() };
      });

      const severityParams = {
        start_date: '2023-01-01',
        end_date: '2023-12-31',
        pest_id: 1,
        t_min: 50,
        t_max: 90,
        in_f: true,
      };

      // Call method
      overlayHelper.addInfoWindowEvents(selectedPanel, severityParams);

      // Verify rectangle click listener was added
      expect(mockRectangle.addListener).toHaveBeenCalledWith('click', expect.any(Function));

      // Verify info window was created with loading template
      expect(mockGoogleWrapper.createInfoWindow).toHaveBeenCalledWith({
        content: expect.stringContaining('lds-ring'),
        position: eventMock.latLng,
      });

      // Wait for promises to resolve
      vi.useFakeTimers();
      await vi.runAllTimersAsync();

      // Verify point details were fetched
      expect(mockDatabaseClient.fetchPointDetails).toHaveBeenCalledWith({
        latitude: 35.123,
        longitude: -118.456,
        start_date: '2023-01-01',
        end_date: '2023-12-31',
        pest_id: 1,
        t_min: 50,
        t_max: 90,
        in_f: true,
        panel: 'disease',
      });

      // Verify content was updated with fetched details
      expect(mockInfoWindow.setContent).toHaveBeenCalledWith(mockPointDetails);
    });
  });

  describe('utility methods', () => {
    it('should convert severity to color based on gradient', () => {
      const gradient = {
        10: '#0000FF',
        20: '#00FF00',
        30: '#FF0000',
      };

      expect(overlayHelper.severityToColor(5, gradient)).toBe('#0000FF');
      expect(overlayHelper.severityToColor(10, gradient)).toBe('#0000FF');
      expect(overlayHelper.severityToColor(15, gradient)).toBe('#00FF00');
      expect(overlayHelper.severityToColor(20, gradient)).toBe('#00FF00');
      expect(overlayHelper.severityToColor(25, gradient)).toBe('#FF0000');
      expect(overlayHelper.severityToColor(30, gradient)).toBe('#FF0000');
      expect(overlayHelper.severityToColor(35, gradient)).toBe('');
    });

    it('should return empty string for undefined color', () => {
      const gradient = {
        10: '#0000FF',
      };

      expect(overlayHelper.severityToColor(15, gradient)).toBe('');
    });

    it('should handle empty gradient', () => {
      const gradient = {};

      expect(overlayHelper.severityToColor(5, gradient)).toBe('');
    });

    it('should clear rectangles and reset array', () => {
      overlayHelper.rectangles = [mockRectangle, mockRectangle];

      overlayHelper.clearRectangles();

      expect(mockRectangle.setMap).toHaveBeenCalledTimes(2);
      expect(mockRectangle.setMap).toHaveBeenCalledWith(null);
      expect(overlayHelper.rectangles).toEqual([]);
    });

    it('should fetch severities from DatabaseClient', async () => {
      const severityParams = {
        start_date: '2023-01-01',
        end_date: '2023-12-31',
        pest_id: 1,
        t_min: 50,
        t_max: 90,
        in_f: true,
      };

      const mockResponse = [{ lat: 35.1, lng: -118.4, value: 10 }];
      mockDatabaseClient.fetchSeverities.mockResolvedValue(mockResponse);

      const result = await overlayHelper.getSeverities(severityParams);

      expect(mockDatabaseClient.fetchSeverities).toHaveBeenCalledWith(severityParams);
      expect(result).toEqual(mockResponse);
    });
  });
});
