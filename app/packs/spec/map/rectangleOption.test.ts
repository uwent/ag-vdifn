import { COLORS } from '../../src/components/common/TypeScript/colors'
import RectangleOption from '../../src/components/map/TypeScript/rectangleOption'

const latitude: number = 41.88
const longitude: number = -87.62
const latitudeOffset: number = 0.05
const longitudeOffset: number = 0.05
const strokeOpacity: number = 1.0
const strokeWeight: number = 0.05
const color: string = '#ffff'
const fillOpacity: number = 0.25
const map: any = {}

it('returns properties', () => {
  const rectangleOption = new RectangleOption(latitude, longitude, color, map)
  expect(rectangleOption.latitude).toEqual(latitude)
  expect(rectangleOption.longitude).toEqual(longitude)
  expect(rectangleOption.strokeColor).toEqual(COLORS.brightRed)
  expect(rectangleOption.strokeOpacity).toEqual(strokeOpacity)
  expect(rectangleOption.strokeWeight).toEqual(strokeWeight)
  expect(rectangleOption.fillColor).toEqual(color)
  expect(rectangleOption.map).toEqual(map)
  expect(rectangleOption.fillOpacity).toEqual(fillOpacity)
  expect(rectangleOption.bounds).toEqual({
    north: latitude - latitudeOffset,
    south: latitude + latitudeOffset,
    east: longitude + longitudeOffset,
    west: longitude - longitudeOffset,
  })
})
