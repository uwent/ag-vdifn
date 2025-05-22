import { fireEvent, render, screen } from '@testing-library/svelte';
import { get } from 'svelte/store';
import moment from 'moment';

import DiseasePanel from '@components/sidebar/DiseasePanel.svelte';
import {
  selectedDisease,
  diseasePanelState,
  selectedPanel,
  panelKey,
  diseasePanelParams,
  startDate,
  endDate,
  pestId,
  defaults,
  extents,
} from '@store';
import type { Pest } from '@types';

let diseasePanel;

beforeEach(() => {
  vi.stubGlobal('gtag', () => null);
  const { component } = render(DiseasePanel, {
    props: {
      data: [],
    },
  });
  diseasePanel = component;
  startDate.set('2000-10-10');
  endDate.set('2000-11-10');
  pestId.set(1);
  selectedDisease.set({ id: 1, name: 'bug' } as Pest);
});

test('sets selectedPanel state to disease panel on mount', () => {
  expect(get(selectedPanel)).toEqual('disease');
});

test('should dispatch submit params when button is clicked', () => {
  const button = screen.getByText('Submit');
  fireEvent.click(button);
  expect(get(diseasePanelParams)).toEqual({
    start_date: '2000-10-10',
    end_date: '2000-11-10',
    in_f: true,
    pest_id: 1,
    ...extents[defaults.extent],
  });
});

test('should update disease panel state', async () => {
  const button = screen.getByText('Submit');
  fireEvent.click(button);
  expect(get(diseasePanelState)).toEqual({
    selectedPest: { id: 1, name: 'bug' },
    loaded: true,
    mapExtent: defaults.extent,
  });
});

test('sets context data for child elements', () => {
  expect(diseasePanel.$$.context.get(panelKey)).toEqual({
    panelType: 'disease',
    getCrops: expect.any(Function),
    dateToolTip: {
      startDate: expect.any(String),
      endDate: expect.any(String),
      startLabel: expect.any(String),
    },
    defaultStartDate: moment.utc().subtract(1, 'week').format('YYYY-MM-DD'),
    getPestName: expect.any(Function),
  });
});
