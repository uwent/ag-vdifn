import { render } from '@testing-library/svelte'
import { mapKey } from '../../src/store/store'
import Map from '../../src/components/map/Map.svelte'
import { Loader } from '@googlemaps/js-api-loader'

jest.mock('@googlemaps/js-api-loader')

let mapComponent

beforeEach(() => {
  const { component } = render(Map)
  mapComponent = component
})

it('sets context', () => {
  expect(mapComponent.$$.context.get(mapKey)).toEqual({
    getMap: expect.any(Function),
    getGoogle: expect.any(Function),
  })
})

it('calls google maps loader', () => {
  expect(Loader).toHaveBeenCalled()
  const instance = (Loader as any).mock.instances[0]
  expect(instance.load).toHaveBeenCalled()
})
