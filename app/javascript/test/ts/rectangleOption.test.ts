import { describe, it, expect, beforeEach } from 'vitest';
import RectangleOption from '@ts/rectangleOption';

describe('RectangleOption', () => {
  let map;

  beforeEach(() => {
    // Create a simple mock map object
    map = {};
  });

  it('should create a RectangleOption with default values', () => {
    const lat = 40.7128;
    const lng = -74.006;

    const rectOption = new RectangleOption(lat, lng, map);

    expect(rectOption.latitude).toBe(lat);
    expect(rectOption.longitude).toBe(lng);
    expect(rectOption.map).toBe(map);
    expect(rectOption.fillColor).toBe('#ffffff00');
    expect(rectOption.strokeColor).toBe('#000000');
    expect(rectOption.strokeOpacity).toBe(1);
    expect(rectOption.strokeWeight).toBe(0.025);
    expect(rectOption.fillOpacity).toBe(0.5);
    expect(rectOption.severityLevel).toBeNull();
  });

  it('should calculate correct bounds based on latitude and longitude', () => {
    const lat = 40.7128;
    const lng = -74.006;
    const latOffset = 0.05;
    const lngOffset = 0.05;

    const rectOption = new RectangleOption(lat, lng, map);

    // Note: Using the original bounds calculation where north = lat - offset
    expect(rectOption.bounds).toEqual({
      north: lat - latOffset,
      south: lat + latOffset,
      east: lng + lngOffset,
      west: lng - lngOffset,
    });
  });

  it('should accept custom offsets in constructor', () => {
    const lat = 40.7128;
    const lng = -74.006;
    const customLatOffset = 0.1;
    const customLngOffset = 0.2;

    const rectOption = new RectangleOption(lat, lng, map, {
      latitudeOffset: customLatOffset,
      longitudeOffset: customLngOffset,
    });

    expect(rectOption.bounds).toEqual({
      north: lat - customLatOffset,
      south: lat + customLatOffset,
      east: lng + customLngOffset,
      west: lng - customLngOffset,
    });
  });

  it('should accept custom styling options', () => {
    const customOptions = {
      strokeColor: '#ff0000',
      strokeOpacity: 0.5,
      strokeWeight: 2,
      fillColor: '#0000ff',
      fillOpacity: 0.7,
    };

    const rectOption = new RectangleOption(40.7128, -74.006, map, customOptions);

    expect(rectOption.strokeColor).toBe(customOptions.strokeColor);
    expect(rectOption.strokeOpacity).toBe(customOptions.strokeOpacity);
    expect(rectOption.strokeWeight).toBe(customOptions.strokeWeight);
    expect(rectOption.fillColor).toBe(customOptions.fillColor);
    expect(rectOption.fillOpacity).toBe(customOptions.fillOpacity);
  });
});
