import { render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';

import SetContextTest from '../testComponents/SetContextTest.svelte';
import SeverityGradient from '@components/leftSidebar/CustomGradientSelection.svelte';
import {
  panelKey,
  mapRange,
  twoPointGradientState,
  threePointGradientState,
  customPanelState,
} from '@store';

const mapMin = 5;
const mapMax = 42;

beforeEach(() => {
  mapRange.set({ min: mapMin, max: mapMax });
  twoPointGradientState.set({} as any);
  threePointGradientState.set({} as any);
  render(SetContextTest, {
    props: {
      Component: SeverityGradient,
      context_key: panelKey,
      context_value: {},
    },
  });
});

test('defaults to 2 point gradient', async () => {
  await tick();
  expect(screen.getByTitle('gradient-2-point')).toBeChecked();
  expect(screen.getByTitle('gradient-3-point')).not.toBeChecked();
});

test('displays params once submitted', async () => {
  const state = {
    params: {
      start_date: '2020-10-10',
      end_date: '2020-10-20',
      t_min: 50,
      t_max: null,
      in_f: true,
    },
  } as any;
  customPanelState.set(state);
  await tick();
  expect(screen.getByTitle('submitted-params').textContent).toContain(
    'Start Date: 2020-10-10 End Date: 2020-10-20 Tmin: 50 Tmax: None Units: Fahrenheit',
  );
});

test('displays map min and map max', () => {
  expect(screen.getByTitle('Map range').textContent).toContain(`${mapMin} - ${mapMax}`);
});
