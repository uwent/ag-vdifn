import { fireEvent, render } from '@testing-library/svelte';
import { tick } from 'svelte';

import SetContextTest from '../SetContextTest.svelte';
import TminMaxDisplay from '@components/sidebar/TminMaxDisplay.svelte';
import { c_to_f, f_to_c } from '@ts/utils';
import { panelKey, selectedPanel, selectedPest, selectedDDModel } from '@store';
import type { DegreeDayModel, Pest } from '@types';

const disease = { id: 1, name: 'disease', t_min: null, t_max: null };
const bug1 = { id: 2, name: 'bug1', t_min: 50, t_max: 86 } as Pest;
const bug2 = { id: 3, name: 'bug2', t_min: 42, t_max: null } as Pest;
const dd1 = {
  id: 4,
  name: 'Base 50/86',
  name_c: 'Base 10/30',
  t_min: 50,
  t_max: 86,
} as DegreeDayModel;
const dd2 = { id: 5, name: 'Base 50', name_c: 'Base 10', t_min: 50, t_max: null } as DegreeDayModel;
const cropData = [
  { id: 1, name: 'corn', afflictions: [disease, bug1] },
  { id: 2, name: 'carrots', afflictions: [disease, bug2] },
];
const ddData = [dd1, dd2];

let minText;
let maxText;
let tempToggle;

describe('Temperature conversion helpers', () => {
  test('converts c to f correctly', () => {
    expect(c_to_f(null)).toBeNull();
    expect(c_to_f(0)).toEqual(32);
    expect(c_to_f(-40)).toEqual(-40);
    expect(c_to_f(37)).toEqual(98.6);
  });

  test('converts f to c correctly', () => {
    expect(f_to_c(null)).toBeNull();
    expect(f_to_c(32)).toEqual(0);
    expect(f_to_c(-40)).toEqual(-40);
    expect(f_to_c(85)).toEqual(29.4);
  });
});

describe('TminMaxDisplay component for disease/insect', () => {
  beforeEach(() => {
    const { getByTitle } = render(SetContextTest, {
      props: {
        Component: TminMaxDisplay,
        context_key: panelKey,
        context_value: {
          panelType: 'disease',
          getCrops: () => cropData,
        },
      },
    });
    minText = getByTitle('Min temp');
    maxText = getByTitle('Max temp');
    tempToggle = getByTitle('temp-unit-toggle') as HTMLInputElement;
  });

  test('shows min/max temps for disease panel', async () => {
    expect(minText.textContent).toBe('None');
    expect(maxText.textContent).toBe('None');
  });

  test('shows min/max temps for insect panel', async () => {
    selectedPanel.set('insect');
    selectedPest.set(bug1);
    await tick();
    expect(minText.textContent).toBe(`${bug1.t_min}`);
    expect(maxText.textContent).toBe(`${bug1.t_max}`);

    selectedPest.set(bug2);
    await tick();
    expect(minText.textContent).toBe(`${bug2.t_min}`);
    expect(maxText.textContent).toBe('None');
  });

  test('converts values between celcius and fahrenheit when temp unit is toggled', async () => {
    selectedPanel.set('insect');
    selectedPest.set(bug1);
    await tick();

    expect(minText.textContent).toBe(`${bug1.t_min}`);
    expect(maxText.textContent).toBe(`${bug1.t_max}`);

    await fireEvent.click(tempToggle);
    expect(tempToggle.checked).toEqual(false);
    expect(minText.textContent).toBe(`${f_to_c(bug1.t_min)}`);
    expect(maxText.textContent).toBe(`${f_to_c(bug1.t_max)}`);

    await fireEvent.click(tempToggle);
    expect(tempToggle.checked).toEqual(true);
    expect(minText.textContent).toBe(`${bug1.t_min}`);
    expect(maxText.textContent).toBe(`${bug1.t_max}`);
  });

  test('defaults temp to fahrenheit', () => {
    expect(tempToggle.checked).toEqual(true);
  });
});

describe('TminMaxDisplay component for custom panel', () => {
  beforeEach(() => {
    const { getByTitle } = render(SetContextTest, {
      props: {
        Component: TminMaxDisplay,
        context_key: panelKey,
        context_value: {
          panelType: 'custom',
          getModels: () => ddData,
        },
      },
    });
    minText = getByTitle('Min temp');
    maxText = getByTitle('Max temp');
    tempToggle = getByTitle('temp-unit-toggle') as HTMLInputElement;
  });

  test('shows min/max temps for custom panel', async () => {
    selectedDDModel.set(dd1);
    await tick();
    expect(minText.textContent).toBe(`${dd1.t_min}`);
    expect(maxText.textContent).toBe(`${dd1.t_max}`);

    selectedDDModel.set(dd2);
    await tick();
    expect(minText.textContent).toBe(`${dd2.t_min}`);
    expect(maxText.textContent).toBe('None');
  });

  test('defaults temp to fahrenheit', () => {
    expect(tempToggle.checked).toEqual(true);
  });

  test('converts values between celcius and fahrenheit when temp unit is toggled', async () => {
    selectedDDModel.set(dd1);

    await fireEvent.click(tempToggle);
    expect(tempToggle.checked).toEqual(false);
    expect(minText.textContent).toBe(`${f_to_c(dd1.t_min)}`);
    expect(maxText.textContent).toBe(`${f_to_c(dd1.t_max)}`);

    await fireEvent.click(tempToggle);
    expect(tempToggle.checked).toEqual(true);
    expect(minText.textContent).toBe(`${dd1.t_min}`);
    expect(maxText.textContent).toBe(`${dd1.t_max}`);
  });
});
