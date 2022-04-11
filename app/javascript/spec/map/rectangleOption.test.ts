import { COLORS } from '../../src/components/common/ts/colors'
import RectangleOption from '../../src/components/map/ts/rectangleOption'

const latitude = 41.88
const longitude = -87.62
const latitudeOffset = 0.05
const longitudeOffset = 0.05
const strokeOpacity = 1.0
const strokeWeight = 0.05
const color = '#ffff'
const fillOpacity = 0.25
const map: any = {}

it('returns properties', () => {
  const rectangleOption = new RectangleOption(latitude, longitude, color, map)

  expect(rectangleOption.latitude).toEqual(latitude)
  expect(rectangleOption.longitude).toEqual(longitude)
  expect(rectangleOption.fillColor).toEqual(color)
  expect(rectangleOption.map).toEqual(map)

  expect(rectangleOption.bounds).toEqual({
    north: latitude - latitudeOffset,
    south: latitude + latitudeOffset,
    east: longitude + longitudeOffset,
    west: longitude - longitudeOffset
  })

  expect(rectangleOption.strokeColor).toEqual(expect.anything())
  expect(rectangleOption.strokeOpacity).toEqual(expect.anything())
  expect(rectangleOption.strokeWeight).toEqual(expect.anything())
  expect(rectangleOption.fillOpacity).toEqual(expect.anything())
})
