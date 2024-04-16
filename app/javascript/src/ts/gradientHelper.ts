import { round } from './utils';
import ColorHelper from './map/colorHelper';

export default class GradientHelper {
  mapRangeToColors(options) {
    const {
      min,
      middleMin,
      middleMax,
      max,
      totalLevels,
    }: {
      min: number;
      middleMin: number;
      middleMax: number;
      max: number;
      totalLevels: number;
    } = options;

    const result = {};
    result[min] = ColorHelper.color(0, totalLevels);

    if (min === max) return result;
    if (middleMin && middleMax) {
      const lowerRanges = this.calculateRanges(min, middleMin, totalLevels - 2);
      const upperRanges = this.calculateRanges(middleMax, max, totalLevels - 2);
      lowerRanges.forEach((range, index) => {
        result[range[1]] = ColorHelper.color(index + 1, totalLevels);
      });
      result[middleMax] = ColorHelper.colorInverse(0, totalLevels);
      upperRanges.forEach((range, index) => {
        result[range[1]] = ColorHelper.colorInverse(index + 1, totalLevels);
      });
      result[Infinity] = ColorHelper.color(0, totalLevels);
    } else {
      const ranges = this.calculateRanges(min, max, totalLevels - 2);
      ranges.forEach((range, index) => {
        result[range[1]] = ColorHelper.color(index + 1, totalLevels);
      });
      result[Infinity] = ColorHelper.color(totalLevels, totalLevels);
    }
    return result;
  }

  gradientValues(options) {
    const {
      min,
      max,
      intermediateLevels,
    }: { min: number; max: number; intermediateLevels: number } = options;
    return {
      userMin: min,
      userMax: max,
      intermediateValues: this.calculateRanges(min, max, intermediateLevels),
    };
  }

  private calculateRanges(min: number, max: number, levels: number): number[][] {
    if (levels <= 0) return [];
    const ranges: number[][] = [];
    const length_of_range = (max - min) / levels;
    ranges.push([min, round(min + length_of_range, 1)]);
    for (let i = 0; i < levels - 1; i++) {
      const lastRange = ranges[ranges.length - 1];
      ranges.push([lastRange[1], round(lastRange[1] + length_of_range, 1)]);
    }
    ranges[ranges.length - 1][1] = max;
    return ranges;
  }
}
