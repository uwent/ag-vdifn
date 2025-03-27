import { describe, test, expect } from 'vitest';
import ColorHelper from '@ts/colorHelper';

describe('ColorHelper', () => {
  // Test initialization with different palettes
  test('should initialize with spectral palette by default', () => {
    const defaultHelper = new ColorHelper();
    const spectralHelper = new ColorHelper('spectral');

    // Default should match spectral
    expect(defaultHelper.color(0, 3)).toBe(spectralHelper.color(0, 3));
    expect(defaultHelper.color(2, 3)).toBe(spectralHelper.color(2, 3));
  });

  test('should initialize with viridis palette when specified', () => {
    const viridisHelper = new ColorHelper('viridis');
    const spectralHelper = new ColorHelper('spectral');

    // Different palettes should produce different colors
    expect(viridisHelper.color(0, 3)).not.toBe(spectralHelper.color(0, 3));
    expect(viridisHelper.color(2, 3)).not.toBe(spectralHelper.color(2, 3));
  });

  // Test color methods return valid hex colors
  test('color methods should return valid hex colors', () => {
    const helper = new ColorHelper();
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

    // Test regular color method
    expect(helper.color(0, 3)).toMatch(hexColorRegex);
    expect(helper.color(1, 3)).toMatch(hexColorRegex);
    expect(helper.color(2, 3)).toMatch(hexColorRegex);

    // Test inverse color method
    expect(helper.colorInverse(0, 3)).toMatch(hexColorRegex);
    expect(helper.colorInverse(1, 3)).toMatch(hexColorRegex);
    expect(helper.colorInverse(2, 3)).toMatch(hexColorRegex);
  });

  // Test color progressions
  test('color method should produce different colors for different severity levels', () => {
    const helper = new ColorHelper();

    const low = helper.color(0, 3);
    const med = helper.color(1, 3);
    const high = helper.color(2, 3);

    // Colors should all be different
    expect(low).not.toBe(med);
    expect(med).not.toBe(high);
    expect(low).not.toBe(high);
  });

  // Test colorInverse relationship to color
  test('colorInverse should reverse the color scale', () => {
    const helper = new ColorHelper();

    // For a 3-level scale:
    expect(helper.color(0, 3)).toBe(helper.colorInverse(2, 3));
    expect(helper.color(1, 3)).toBe(helper.colorInverse(1, 3)); // Middle stays the same
    expect(helper.color(2, 3)).toBe(helper.colorInverse(0, 3));

    // For a 5-level scale:
    expect(helper.color(0, 5)).toBe(helper.colorInverse(4, 5));
    expect(helper.color(1, 5)).toBe(helper.colorInverse(3, 5));
    expect(helper.color(2, 5)).toBe(helper.colorInverse(2, 5)); // Middle stays the same
    expect(helper.color(3, 5)).toBe(helper.colorInverse(1, 5));
    expect(helper.color(4, 5)).toBe(helper.colorInverse(0, 5));
  });

  // Test handling of different severity levels
  test('should distribute colors appropriately for different severity level counts', () => {
    const helper = new ColorHelper();

    // For different scales, the extremes should be the same
    expect(helper.color(0, 3)).toBe(helper.color(0, 5));
    expect(helper.color(2, 3)).toBe(helper.color(4, 5));

    // And the middle should be the same
    expect(helper.color(1, 3)).toBe(helper.color(2, 5));

    // But intermediate values should be different
    expect(helper.color(1, 3)).not.toBe(helper.color(1, 5));
    expect(helper.color(1, 3)).not.toBe(helper.color(3, 5));
  });

  // Test edge cases
  test('should handle fractional severity values', () => {
    const helper = new ColorHelper();
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

    const color = helper.color(0.5, 3);
    expect(color).toMatch(hexColorRegex);

    // Should be between the two integer colors
    expect(color).not.toBe(helper.color(0, 3));
    expect(color).not.toBe(helper.color(1, 3));
  });
});
