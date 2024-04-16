import { render } from '@testing-library/svelte';
import { get } from 'svelte/store';
import { tick } from 'svelte';
import type { Mock } from 'vitest';

import SetContextTest from '../testComponents/SetContextTest.svelte';
import SeverityOverlay from '@components/map/SeverityOverlay.svelte';
import OverlayHelper from '@ts/map/overlayHelper';
import type { Severity } from '@types';
import {
  mapKey,
  diseasePanelParams,
  insectPanelParams,
  customPanelParams,
  diseasePanelState,
  insectPanelState,
  selectedPanel,
  overlayGradient,
  overlayLoading,
  mapRange,
} from '@store';

vi.mock('@ts/map/overlayHelper');

const severityParams = {
  start_date: '2020-10-10',
  end_date: '2020-10-15',
  pest_id: 1,
};
const customSeverityParams = {
  start_date: '2020-10-10',
  end_date: '2020-10-15',
  t_min: '10',
  t_max: '15',
  in_fahrenheit: true,
};
const severities: Severity[] = [
  { lat: 5, long: 10, level: 1 },
  { lat: 2, long: 4, level: 2 },
];

const mockUpdateOverlay = vi.fn();
const mockUpdateOverlayGradient = vi.fn();
const mockShowOverlay = vi.fn();
const mockShowBounds = vi.fn();
let overlayLoadingSpy;
let mapRangeSpy;

beforeAll(() => {
  (OverlayHelper as Mock).mockImplementation(() => {
    return {
      updateOverlay: mockUpdateOverlay,
      updateOverlayGradient: mockUpdateOverlayGradient,
      hideOverlay: vi.fn(),
      closeInfoWindow: vi.fn(),
      showOverlay: mockShowOverlay,
      showBounds: mockShowBounds,
      severities: severities,
      min: 10,
      max: 15,
    };
  });
});

beforeEach(() => {
  mapRangeSpy = vi.spyOn(mapRange, 'set');
  overlayLoadingSpy = vi.spyOn(overlayLoading, 'set');

  render(SetContextTest, {
    props: {
      Component: SeverityOverlay,
      context_key: mapKey,
      context_value: {
        getMap: () => {},
        getGoogle: () => {},
      },
    },
  });
});

describe('updating overlay for disease panel params', () => {
  beforeEach(() => {
    diseasePanelParams.set(severityParams);
  });

  test('updates overlay when afflictionParams is updated', () => {
    expect(mockUpdateOverlay).toHaveBeenCalledWith(severityParams, 'disease');
  });

  test.skip('sets overlay loading to true, then false after update overlay finished loading', async () => {
    mockUpdateOverlay.mockResolvedValue({});
    await tick();
    expect(overlayLoadingSpy).toHaveBeenNthCalledWith(1, true);
    expect(overlayLoadingSpy).toHaveBeenNthCalledWith(2, false);
  });

  test('updates store with new severities', async () => {
    mockUpdateOverlay.mockResolvedValue({});
    expect(get(diseasePanelState)['severities']).toEqual(severities);
    expect(get(diseasePanelState)['severityParams']).toEqual(severityParams);
  });
});

describe('updating overlay for insect panel params', () => {
  beforeEach(() => {
    insectPanelParams.set(severityParams);
  });

  test('updates overlay when afflictionParams is updated', () => {
    expect(mockUpdateOverlay).toHaveBeenCalledWith(severityParams, 'insect');
  });

  test.skip('sets overlay loading to true, then false after update overlay finished loading', async () => {
    mockUpdateOverlay.mockResolvedValue({});
    expect(overlayLoadingSpy).toHaveBeenNthCalledWith(1, true);
    expect(overlayLoadingSpy).toHaveBeenNthCalledWith(2, false);
  });

  test('updates store with new severities', () => {
    mockUpdateOverlay.mockResolvedValue({});
    expect(get(insectPanelState)['severities']).toEqual(severities);
    expect(get(insectPanelState)['severityParams']).toEqual(severityParams);
  });
});

describe('updating overlay for custom panel params', () => {
  beforeEach(() => {
    customPanelParams.set(customSeverityParams);
  });

  test.skip('sets overlay loading to true then false after finished loading overlay', async () => {
    mockUpdateOverlay.mockResolvedValue({});
    await tick();
    expect(overlayLoadingSpy).toHaveBeenNthCalledWith(1, true);
    expect(overlayLoadingSpy).toHaveBeenNthCalledWith(2, false);
  });

  test('sets mapRange', () => {
    mockUpdateOverlay.mockResolvedValue({});
    expect(mapRangeSpy).toHaveBeenCalledWith({ max: 15, min: 10 });
  });
});

describe('overlayGradient', () => {
  test('calls updateOverlayGradient', () => {
    const gradientMapping = { a: 1, b: 2 };
    overlayGradient.set(gradientMapping);
    expect(mockUpdateOverlayGradient).toHaveBeenCalledWith(gradientMapping);
  });
});

describe('when new panel is loaded', () => {
  test('loads in insect overlay if it exists', () => {
    insectPanelParams.set(severityParams);
    selectedPanel.set('insect');
    expect(mockShowOverlay).toHaveBeenCalled();
  });
});
