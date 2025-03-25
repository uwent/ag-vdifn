import { describe, it, expect, beforeEach } from 'vitest';
import DataPoint from '@components/map/ts/dataPoint';

describe('DataPoint', () => {
  let mockMap: any;

  beforeEach(() => {
    mockMap = {}; // Mock map object
  });

  describe('constructor', () => {
    it('should initialize with provided values', () => {
      const latitude = 37.7749;
      const longitude = -122.4194;
      const fillColor = '#FF0000';

      const dataPoint = new DataPoint(latitude, longitude, fillColor, mockMap);

      expect(dataPoint.latitude).toBe(latitude);
      expect(dataPoint.longitude).toBe(longitude);
      expect(dataPoint.fillColor).toBe(fillColor);
      expect(dataPoint.map).toBe(mockMap);
    });

    it('should set default values for optional properties', () => {
      const dataPoint = new DataPoint(0, 0, '#000000', mockMap);

      expect(dataPoint.strokeColor).toBe('#808080');
      expect(dataPoint.strokeOpacity).toBe(1.0);
      expect(dataPoint.strokeWeight).toBe(0.05);
      expect(dataPoint.fillOpacity).toBe(0.25);
    });
  });

  describe('calculateBounds', () => {
    it('should calculate bounds correctly based on latitude and longitude', () => {
      const latitude = 40.7128;
      const longitude = -74.006;
      const dataPoint = new DataPoint(latitude, longitude, '#00FF00', mockMap);

      // Testing the bounds object structure and values
      expect(dataPoint.bounds).toEqual({
        north: latitude - 0.05,
        south: latitude + 0.05,
        east: longitude + 0.05,
        west: longitude - 0.05,
      });
    });

    it('should update bounds when latitude and longitude are changed', () => {
      const initialLat = 51.5074;
      const initialLng = -0.1278;
      const dataPoint = new DataPoint(initialLat, initialLng, '#0000FF', mockMap);

      const initialBounds = { ...dataPoint.bounds };

      // Simulate changing latitude and longitude and recalculating bounds
      // Since calculateBounds is private, we need to create a new instance
      const newLat = 48.8566;
      const newLng = 2.3522;
      const updatedDataPoint = new DataPoint(newLat, newLng, '#0000FF', mockMap);

      expect(updatedDataPoint.bounds).not.toEqual(initialBounds);
      expect(updatedDataPoint.bounds).toEqual({
        north: newLat - 0.05,
        south: newLat + 0.05,
        east: newLng + 0.05,
        west: newLng - 0.05,
      });
    });
  });

  describe('edge cases', () => {
    it('should handle zero values for latitude and longitude', () => {
      const dataPoint = new DataPoint(0, 0, '#FFFFFF', mockMap);

      expect(dataPoint.bounds).toEqual({
        north: -0.05,
        south: 0.05,
        east: 0.05,
        west: -0.05,
      });
    });

    it('should handle negative values for latitude and longitude', () => {
      const latitude = -33.8688;
      const longitude = -151.2093;
      const dataPoint = new DataPoint(latitude, longitude, '#FFFF00', mockMap);

      expect(dataPoint.bounds).toEqual({
        north: latitude - 0.05,
        south: latitude + 0.05,
        east: longitude + 0.05,
        west: longitude - 0.05,
      });
    });

    it('should handle extreme values for latitude and longitude', () => {
      const latitude = 89.9999; // Near North Pole
      const longitude = 179.9999; // Near International Date Line
      const dataPoint = new DataPoint(latitude, longitude, '#00FFFF', mockMap);

      expect(dataPoint.bounds).toEqual({
        north: latitude - 0.05,
        south: latitude + 0.05,
        east: longitude + 0.05,
        west: longitude - 0.05,
      });
    });
  });
});
