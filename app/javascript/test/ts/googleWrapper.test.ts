// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from 'vitest';
import GoogleWrapper from '@ts/googleWrapper';
import RectangleOption from '@ts/rectangleOption';

// Mock Google Maps API
const createMockGoogleMaps = () => {
  return {
    maps: {
      Map: vi.fn().mockImplementation((container, options) => ({
        container,
        options,
      })),
      LatLng: vi.fn().mockImplementation((lat, lng) => ({
        lat: () => lat,
        lng: () => lng,
      })),
      Rectangle: vi.fn().mockImplementation((options) => ({
        ...options,
        setMap: vi.fn(),
        getBounds: vi.fn(),
      })),
      InfoWindow: vi.fn().mockImplementation((options) => ({
        ...options,
        open: vi.fn(),
        close: vi.fn(),
      })),
    },
  };
};

describe('GoogleWrapper', () => {
  let mockGoogle: ReturnType<typeof createMockGoogleMaps>;
  let googleWrapper: GoogleWrapper;

  beforeEach(() => {
    mockGoogle = createMockGoogleMaps();
    googleWrapper = new GoogleWrapper(mockGoogle);
  });

  it('should create a map instance', () => {
    const container = document.createElement('div');
    const options = { zoom: 10, center: { lat: 0, lng: 0 } };

    const map = googleWrapper.createMap(container, options);

    expect(mockGoogle.maps.Map).toHaveBeenCalledWith(container, options);
    expect(map).toBeDefined();
    expect(map.container).toBe(container);
    expect(map.options).toBe(options);
  });

  it('should create a LatLng instance', () => {
    const lat = 40.7128;
    const lng = -74.006;

    const latLng = googleWrapper.latLng(lat, lng);

    expect(mockGoogle.maps.LatLng).toHaveBeenCalledWith(lat, lng);
    expect(latLng.lat()).toBe(lat);
    expect(latLng.lng()).toBe(lng);
  });

  it('should create a Rectangle instance from RectangleOption', () => {
    const map = googleWrapper.createMap(document.createElement('div'), {});
    const rectOptions = new RectangleOption(40.7128, -74.006, map);

    const rectangle = googleWrapper.createRectangle(rectOptions);

    expect(mockGoogle.maps.Rectangle).toHaveBeenCalledWith(rectOptions);
    expect(rectangle).toBeDefined();
  });

  it('should create a bounds rectangle', () => {
    const map = googleWrapper.createMap(document.createElement('div'), {});
    const bounds = {
      north: 41,
      south: 40,
      east: -73,
      west: -75,
    };

    const boundsRectangle = googleWrapper.createBounds(bounds, map);

    expect(mockGoogle.maps.Rectangle).toHaveBeenCalledWith(
      expect.objectContaining({
        bounds: bounds,
        map: map,
        strokeColor: '#000000',
        fillOpacity: 0,
        clickable: false,
      }),
    );
    expect(boundsRectangle).toBeDefined();
  });

  it('should create an InfoWindow', () => {
    const options = {
      content: 'Test content',
      position: googleWrapper.latLng(40.7128, -74.006),
    };

    const infoWindow = googleWrapper.createInfoWindow(options);

    expect(mockGoogle.maps.InfoWindow).toHaveBeenCalledWith(options);
    expect(infoWindow).toBeDefined();
  });
});
