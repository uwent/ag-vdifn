import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';

import Interface from '@components/leftSidebar/Interface.svelte';
import type { CropWithPests, DegreeDayModel } from '@types';

beforeEach(() => {
  render(Interface, {
    props: {
      diseasePanelData: [
        {
          id: 1,
          name: 'potato',
          pests: [
            { id: 5, name: 'late blight', t_min: 5, t_max: 10 },
            { id: 10, name: 'black death', t_min: 10, t_max: 100 },
          ],
        },
      ] as CropWithPests[],
      insectPanelData: [
        {
          id: 1,
          name: 'potato',
          pests: [
            { id: 10, name: 'grasshopper' },
            { id: 45, name: 'caterpillar' },
          ],
        },
      ] as CropWithPests[],
      customPanelData: [
        {
          id: 40,
          name: 'Base 50.0°F',
          remote_name: 'dd_50_none',
          t_min: 50.0,
          t_max: null,
          name_c: 'Base 10.0°C',
        },
      ] as DegreeDayModel[],
    },
  });
});

test('disease tab is selected by default', async () => {
  await tick();
  expect(screen.getByRole('radio', { name: 'Disease' }));
  expect(screen.getByTestId('disease-panel'));
  expect(screen.getByRole('combobox', { name: 'Disease' }));
  expect(screen.queryByTestId('insect-panel')).not.exist;
  expect(screen.queryByTestId('custom-panel')).not.exist;
});

test('shows insect panel when insect tab is selected', async () => {
  await tick();
  const insectTab = screen.getByRole('radio', { name: 'Insect' });
  await fireEvent.click(insectTab);
  expect(screen.getByTestId('insect-panel'));
  expect(screen.getByRole('combobox', { name: 'Insect' }));
  expect(screen.queryByTestId('disease-panel')).not.exist;
  expect(screen.queryByTestId('custom-panel')).not.exist;
});

test('shows custom panel when custom tab is selected', async () => {
  await tick();
  const customTab = screen.getByRole('radio', { name: 'Custom' });
  await fireEvent.click(customTab);
  expect(screen.getByTestId('custom-panel'));
  expect(screen.queryByTestId('disease-panel')).not.exist;
  expect(screen.queryByTestId('insect-panel')).not.exist;
});
