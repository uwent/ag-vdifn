import { describe, it, expect } from 'vitest';
import { f_to_c, c_to_f, round, strToNum } from '@ts/utils';

describe('f_to_c', () => {
  it('converts 32°F to 0°C', () => {
    expect(f_to_c(32)).toBe(0);
  });

  it('converts 212°F to 100°C', () => {
    expect(f_to_c(212)).toBe(100);
  });

  it('returns null when input is null', () => {
    expect(f_to_c(null)).toBe(null);
  });

  it('handles negative temperatures', () => {
    expect(f_to_c(-40)).toBe(-40); // -40 is the same in both scales
  });

  it('rounds to one decimal place', () => {
    expect(f_to_c(68.5)).toBe(20.3); // (68.5 - 32) * 5/9 = 20.27777... which rounds to 20.3
  });
});

describe('c_to_f', () => {
  it('converts 0°C to 32°F', () => {
    expect(c_to_f(0)).toBe(32);
  });

  it('converts 100°C to 212°F', () => {
    expect(c_to_f(100)).toBe(212);
  });

  it('returns null when input is null', () => {
    expect(c_to_f(null)).toBe(null);
  });

  it('handles negative temperatures', () => {
    expect(c_to_f(-40)).toBe(-40); // -40 is the same in both scales
  });

  it('rounds to one decimal place', () => {
    expect(c_to_f(36.5)).toBe(97.7); // 36.5 * 9/5 + 32 = 97.7
  });
});

describe('round', () => {
  it('rounds to nearest integer by default', () => {
    expect(round(5.4)).toBe(5);
    expect(round(5.5)).toBe(6);
    expect(round(-5.5)).toBe(-5); // Note: Math.round behavior with negative numbers
  });

  it('rounds to specified precision', () => {
    expect(round(5.444, 2)).toBe(5.44);
    expect(round(5.445, 2)).toBe(5.45);
    expect(round(-5.445, 2)).toBe(-5.44); // Note: Math.round behavior with negative numbers
  });

  it('handles zero precision', () => {
    expect(round(5.6, 0)).toBe(6);
  });

  it('handles high precision', () => {
    expect(round(1.23456789, 5)).toBe(1.23457);
  });

  it('handles Number.EPSILON correctly', () => {
    // Testing that adding Number.EPSILON helps with floating point precision
    expect(round(0.1 + 0.2, 1)).toBe(0.3); // Would be 0.30000000000000004 without epsilon correction
  });
});

describe('strToNum', () => {
  it('converts string numbers to numbers', () => {
    expect(strToNum('123')).toBe(123);
    expect(strToNum('123.45')).toBe(123.45);
  });

  it('returns the same number when input is already a number', () => {
    expect(strToNum(123)).toBe(123);
    expect(strToNum(123.45)).toBe(123.45);
  });

  it('returns NaN for empty strings', () => {
    expect(Number.isNaN(strToNum(''))).toBe(true);
  });

  it('returns NaN for invalid number strings', () => {
    expect(Number.isNaN(strToNum('not a number'))).toBe(true);
  });

  it('handles negative numbers', () => {
    expect(strToNum('-123')).toBe(-123);
    expect(strToNum(-123)).toBe(-123);
  });
});
