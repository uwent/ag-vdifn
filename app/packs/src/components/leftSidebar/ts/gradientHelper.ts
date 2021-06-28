import _ from "lodash"
import ColorHelper from "../../map/ts/colorHelper"

export default class GradientHelper {

  mapRangeToColors(options) {
    const { min, middleMin, middleMax, max, totalLevels }: {
      min: number,
      middleMin: number,
      middleMax: number,
      max: number,
      totalLevels: number,
    } = options

    let result = {}
    
    result[min] = ColorHelper.color(0, totalLevels)

    if (min === max) return result

    if (middleMin && middleMax) {
      const lowerRanges = this.calculateRanges(min, middleMin, totalLevels - 2)
      const upperRanges = this.calculateRanges(middleMax, max, totalLevels - 2)
      lowerRanges.forEach((range, index) => {
        result[range[1]] = ColorHelper.color(index + 1, totalLevels)
      })
      result[middleMax] = ColorHelper.colorInverse(0, totalLevels)
      upperRanges.forEach((range, index) => {
        result[range[1]] = ColorHelper.colorInverse(index + 1, totalLevels)
      })
      result[Infinity] = ColorHelper.color(0, totalLevels)
    } else {
      const ranges = this.calculateRanges(min, max, totalLevels - 2)
      ranges.forEach((range, index) => {
        result[range[1]] = ColorHelper.color(index + 1, totalLevels)
      })
      result[Infinity] = ColorHelper.color(totalLevels, totalLevels)
    }
    return result
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
    if (levels <= 0) return []
    let ranges: number[][] = []
    const length_of_range = (max - min) / levels
    ranges.push([min, _.round(min + length_of_range, 1)])
    for(let i = 0; i < levels - 1; i ++) {
      const latestRange = _.last<number[]>(ranges)
      ranges.push([
        _.round(_.last<number>(latestRange), 1),
        _.round(_.last<number>(latestRange) + length_of_range, 1)
      ])
    }
    const lastRangeIndex = _.findLastIndex(ranges)
    ranges[lastRangeIndex][1] = max
    return ranges
  }
}
