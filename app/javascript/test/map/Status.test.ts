import { render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';

import Status from '@components/map/Status.svelte';
import { selectedPanel, insectPanelState, diseasePanelState, customPanelState } from '@store';

beforeEach(() => {
  render(Status);
});

describe('when disease panel selected', () => {
  test('shows feedback when no model is submitted', async () => {
    selectedPanel.set('disease');
    await tick();
    expect(screen.getByText('No model submitted')).to.exist;
  });

  test('shows current affliction name', async () => {
    selectedPanel.set('disease');
    // diseasePanelState.set({ currentAffliction: { name: 'disease name' } });
    diseasePanelState.set({ currentAffliction: { name: 'disease name' } } as any);
    await tick();
    expect(screen.getByText('disease name')).to.exist;
  });
});

describe('when insect panel selected', () => {
  test('shows feedback when no model is submitted', async () => {
    selectedPanel.set('insect');
    await tick();
    expect(screen.getByText('No model submitted')).to.exist;
  });

  test('shows current affliction name', async () => {
    selectedPanel.set('insect');
    insectPanelState.set({ currentAffliction: { name: 'insect name' } } as any);
    await tick();
    expect(screen.getByText('insect name')).to.exist;
  });
});

describe('when custom panel selected', () => {
  test('shows Tmin and Tmax and temp units', async () => {
    selectedPanel.set('custom');
    customPanelState.set({
      params: { t_min: 5, t_max: 10, in_fahrenheit: true },
      loaded: true,
    } as any);
    await tick();
    expect(screen.getByText('Degree day model: 5/10\u2109')).to.exist;
  });
});
