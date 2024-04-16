import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { get } from 'svelte/store';
import moment from 'moment';

import CustomPanel from '@components/leftSidebar/CustomPanel.svelte';
import {
  customPanelState,
  panelKey,
  selectedPanel,
  overlayLoading,
  customPanelParams,
  startDate,
  endDate,
  tMinTmax,
  customOverlaySubmitted,
  defaults,
} from '@store';

const dd1 = {
  id: 1,
  name: 'Base 50.0°F',
  remote_name: 'dd_50_none',
  t_min: 50.0,
  t_max: null,
  name_c: 'Base 10.0°C',
};
const dd2 = {
  id: 2,
  name: 'Base 50.0°F, Upper 86.0°F',
  remote_name: 'dd_50_86',
  t_min: 50.0,
  t_max: 86.0,
  name_c: 'Base 10.0°C, Upper 30.0°C',
};
const ddData = [dd1, dd2];

let customPanel;
let submitSpy;
let selectedPanelSpy;

beforeEach(() => {
  vi.stubGlobal('gtag', () => null);
  selectedPanelSpy = vi.spyOn(selectedPanel, 'set');
  const { component } = render(CustomPanel, {
    props: {
      data: ddData,
    },
  });
  submitSpy = vi.spyOn(customPanelParams, 'set');
  customPanel = component;
  startDate.set('2000-10-10');
  endDate.set('2000-11-10');
  tMinTmax.set({ t_min: 1, t_max: 2, in_fahrenheit: true });
  customOverlaySubmitted.set(false);
});

test('should set the selected panel state on mount', () => {
  expect(selectedPanelSpy).toHaveBeenCalledWith('custom');
});

test('should dispatch submit params when button is clicked', async () => {
  vi.clearAllMocks();
  const button = screen.getByText('Submit');
  await fireEvent.click(button);
  expect(submitSpy).toHaveBeenCalled();
});

test('sets customOverlaySubmitted to true when submitted', async () => {
  const button = screen.getByText('Submit');
  expect(get(customOverlaySubmitted)).toEqual(false);
  await fireEvent.click(button);
  expect(get(customOverlaySubmitted)).toEqual(true);
});

test('updates state on submit', async () => {
  const button = screen.getByText('Submit');
  await fireEvent.click(button);
  expect(get(customPanelState)).toEqual({
    severities: undefined,
    severyParams: undefined,
    selectedGradient: 1,
    selectedExtent: defaults.extent,
    selectedModel: dd2,
    params: expect.any(Object),
    loaded: true,
  });
});

test('doesnt show the overlay options until submit', async () => {
  customOverlaySubmitted.set(false);
  await tick();
  expect(screen.queryByTestId('gradient-opts')).toBeNull();
  customOverlaySubmitted.set(true);
  await tick();
  expect(screen.getByTestId('gradient-opts')).to.exist;
});

test('displays loading component if options are submitted and the overlay is loading', async () => {
  customOverlaySubmitted.set(true);
  overlayLoading.set(true);
  await tick();
  expect(screen.getByTestId('loading')).to.exist;
});

test('displays severity gradient options if options have been submitted', async () => {
  customOverlaySubmitted.set(true);
  overlayLoading.set(false);
  await tick();
  expect(screen.getByText('Gradient Type')).to.exist;
  expect(screen.getByText('Custom Degree-Day Values')).to.exist;
});

test('sets context data for child elements', () => {
  expect(customPanel.$$.context.get(panelKey)).toEqual({
    panelType: 'custom',
    getModels: expect.any(Function),
    dateToolTip: {
      startDate: 'Biofix',
      endDate: 'Date through which degree-days are accumulated',
    },
    defaultStartDate: moment.utc().startOf('year').format('YYYY-MM-DD'),
  });
});
