import _ from "lodash"
import ColorHelper from "../../map/TypeScript/colorHelper";

export default class GradientHelper {
  // mapRangeMinsToColors(options) {
  //   const { min, max, intermediateLevels, totalLevels, absoluteMax, inverse = false}: { totalLevels: number, min: number, max: number, intermediateLevels: number, absoluteMax: number, inverse: boolean} = options
  //   const ranges = this.calculateRanges(max, min, intermediateLevels);
  //   let result = {}
  //   result[min] = ColorHelper.color(0, totalLevels);
  //   ranges.forEach((range, index) => {
  //     if (inverse) {
  //       result[range[1]] = ColorHelper.colorInverse(index + 1, totalLevels)
  //     } else {
  //       result[range[1]] = ColorHelper.color(index + 1, totalLevels)
  //     }
  //   })
  //   if (inverse) {
  //     result[absoluteMax] = ColorHelper.colorInverse(totalLevels, totalLevels)
  //   } else {
  //     result[absoluteMax] = ColorHelper.color(totalLevels, totalLevels)
  //   }
  //   return result;
  // }

  mapRangeToColors(options) {
    const { min, max, intermediateLevels, totalLevels, inverse = false, toInfinity = false}: { 
      totalLevels: number, min: number, max: number, intermediateLevels: number, inverse: boolean, toInfinity: boolean} = options
    const ranges = this.calculateRanges(min, max, intermediateLevels);
    let result = {}
    ranges.forEach((range, index) => {
      if (inverse) {
        result[range[1]] = ColorHelper.colorInverse(index + 1, totalLevels)
      } else {
        result[range[1]] = ColorHelper.color(index + 1, totalLevels)
      }
    })
    if (inverse) {
      if (toInfinity) {
        result[Infinity] = ColorHelper.colorInverse(totalLevels, totalLevels)
      } else {
        result[max] = ColorHelper.colorInverse(totalLevels, totalLevels)
      }
      result[min] = ColorHelper.colorInverse(0, totalLevels);
    } else {
      if (toInfinity) {
        result[Infinity] = ColorHelper.color(totalLevels, totalLevels)
      }
      result[min] = ColorHelper.color(0, totalLevels);
    }
    return result;
  }

  gradientValues(options) {
    const { min, max, intermediateLevels }: { min: number, max: number, intermediateLevels: number} = options
    return {
      userMin: min,
      userMax: max,
      intermediateValues: this.calculateRanges(min, max, intermediateLevels)
    }
  }

  private calculateRanges(min: number, max: number, levels: number): number[][] {
    if (levels <= 0) return [];
    let ranges: number[][] = [];
    let length_of_range = (max - min) / levels;
    ranges.push([min, _.round(min + length_of_range, 1)])
    for(let i = 0; i < levels - 1; i ++) {
      let latestRange = _.last<number[]>(ranges);
      ranges.push([
        _.round(_.last<number>(latestRange), 1),
        _.round(_.last<number>(latestRange) + length_of_range, 1)
      ])
    }
    const lastRangeIndex = _.findLastIndex(ranges)
    ranges[lastRangeIndex][1] = max;
    return ranges;
  }
}
