import InsectPanel from '@components/leftSidebar/InsectPanel.svelte';
import {
  defaults,
  endDate,
  extents,
  insectPanelParams,
  insectPanelState,
  panelKey,
  pestId,
  selectedInsect,
  selectedPanel,
  startDate,
} from '@store';
import { fireEvent, render, screen } from '@testing-library/svelte';
import type { Pest } from '@types';
import moment from 'moment';
import { get } from 'svelte/store';

let insectPanel;

beforeEach(() => {
  vi.stubGlobal('gtag', () => null);
  const { component } = render(InsectPanel, {
    props: {
      data: [],
    },
  });
  insectPanel = component;
  startDate.set('2000-10-10');
  endDate.set('2000-11-10');
  pestId.set(1);
  selectedInsect.set({ name: 'bug', t_min: 42, t_max: null } as Pest);
});

test('should set selected panel to insect on mount', () => {
  expect(get(selectedPanel)).toEqual('insect');
});

test('should update insect panels state when submit button clicked', async () => {
  const button = screen.getByText('Submit');
  await fireEvent.click(button);

  expect(get(insectPanelState)).toEqual({
    selectedPest: { name: 'bug', t_min: 42, t_max: null },
    loaded: true,
    mapExtent: defaults.extent,
  });
});

test('should dispatch submit params when button is clicked', async () => {
  const button = screen.getByText('Submit');
  await fireEvent.click(button);
  expect(get(insectPanelParams)).toEqual({
    start_date: '2000-10-10',
    end_date: '2000-11-10',
    pest_id: 1,
    t_min: 42,
    t_max: null,
    in_f: true,
    ...extents[defaults.extent],
  });
});

test('sets context data for child elements', () => {
  expect(insectPanel.$$.context.get(panelKey)).toEqual({
    panelType: 'insect',
    getCrops: expect.any(Function),
    dateToolTip: {
      startDate: 'Biofix date for insect',
      endDate: 'Date through which degree days are accumulated',
      startLabel: 'Biofix',
    },
    getPestName: expect.any(Function),
    defaultStartDate: moment.utc().startOf('year').format('YYYY-MM-DD'),
  });
});
