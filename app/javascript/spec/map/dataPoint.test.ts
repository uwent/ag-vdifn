import { COLORS } from '../../src/components/common/TypeScript/colors'
import DataPoint from '../../src/components/map/TypeScript/dataPoint'

const latitude: number = 41.88
const longitude: number = -87.62
const strokeOpacity: number = 1.0
const strokeWeight: number = 0.05
const color: string = '#ffff'
const fillOpacity: number = 0.2
const map: any = {}

it('returns properties', () => {
  const dataPointOptions = new DataPoint(latitude, longitude, color, map)
  expect(dataPointOptions.latitude).toEqual(latitude)
  expect(dataPointOptions.longitude).toEqual(longitude)
  expect(dataPointOptions.strokeColor).toEqual(COLORS.brightRed)
  expect(dataPointOptions.strokeOpacity).toEqual(strokeOpacity)
  expect(dataPointOptions.strokeWeight).toEqual(strokeWeight)
  expect(dataPointOptions.fillColor).toEqual(color)
  expect(dataPointOptions.map).toEqual(map)
  expect(dataPointOptions.fillOpacity).toEqual(fillOpacity)
  expect(dataPointOptions.bounds).toEqual({
    north: 41.82750000000001,
    south: 41.9325,
    east: -87.56750000000001,
    west: -87.6725,
  })
})
