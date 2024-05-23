import { round } from '@ts/utils';
import ColorHelper from './colorHelper';

interface MapRangeToColors {
  min: number;
  middleMin?: number;
  middleMax?: number;
  max: number;
  totalLevels: number;
}

interface GradientValues {
  min: number;
  max: number;
  intermediateLevels: number;
}

export default class GradientHelper {
  mapRangeToColors({ min, middleMin, middleMax, max, totalLevels }: MapRangeToColors): {
    [key: number]: string;
  } {
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

  gradientValues({ min, max, intermediateLevels }: GradientValues) {
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
