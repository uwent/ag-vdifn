import { render } from '@testing-library/svelte';
import { Loader } from '@googlemaps/js-api-loader';

import Map from '@components/map/Map.svelte';
import { mapKey } from '@store';

vi.mock('@googlemaps/js-api-loader');

let mapComponent;

beforeEach(() => {
  const { component } = render(Map);
  mapComponent = component;
});

afterEach(() => {
  vi.clearAllMocks();
});

test('sets context', () => {
  expect(mapComponent.$$.context.get(mapKey)).toEqual({
    getMap: expect.any(Function),
    getGoogle: expect.any(Function),
  });
});

test('calls google maps loader', () => {
  expect(Loader).toHaveBeenCalledOnce();

  // TODO: this worked with Jest, not with Vitest
  // const instance = (Loader as any).mock.instances[0];
  // expect(instance.load).toHaveBeenCalled();
});
