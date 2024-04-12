import { fireEvent, render, screen } from '@testing-library/svelte';

import SetContextTest from '../testComponents/SetContextTest.svelte';
import ModelSelection from '@components/leftSidebar/ModelSelection.svelte';
import { panelKey } from '@store/store';

const data = [
  {
    id: 1,
    name: 'corn',
    afflictions: [{ id: 11, name: 'bug' }],
  },
  {
    id: 2,
    name: 'carrots',
    afflictions: [
      { id: 21, name: 'ladybug' },
      { id: 22, name: 'grasshopper' },
      { id: 23, name: 'fly' },
    ],
  },
];

describe('when data present', () => {
  beforeEach(() => {
    render(SetContextTest, {
      props: {
        Component: ModelSelection,
        context_key: panelKey,
        context_value: {
          getCrops: () => data,
          getAfflictionName: () => 'Disease',
        },
      },
    });
  });

  test('defaults crop and affliction values to first in their respective lists', () => {
    expect(screen.getByTestId('crop-select')).toHaveValue('1');
    expect(screen.getByTestId('affliction-select')).toHaveValue('11');
  });

  test('updates afflictions for selected crop', async () => {
    await fireEvent.change(screen.getByTestId('crop-select'), { target: { value: '2' } });
    expect(screen.getByTestId('affliction-select')).toHaveValue('21');
  });

  test('shows modal when button is clicked', async () => {
    const btn = screen.getByRole('button');
    await fireEvent.click(btn);
    expect(screen.getByRole('dialog', { name: 'bug' }));
  });

  test('closes the modal when close button is clicked', async () => {
    await fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('dialog', { name: 'bug' }));
    await fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog', { name: 'bug' })).not.exist;
  });
});

describe('when data not present', () => {
  beforeEach(() => {
    render(SetContextTest, {
      props: {
        Component: ModelSelection,
        context_key: panelKey,
        context_value: {
          getCrops: () => [],
          getAfflictionName: () => 'Disease',
        },
      },
    });
  });

  test('renders empty select box', () => {
    expect(screen.getByTestId('crop-select'));
    expect(screen.getByTestId('affliction-select'));
  });

  test('does not contain modal button', () => {
    expect(screen.queryByRole('button')).not.exist;
  });
});
