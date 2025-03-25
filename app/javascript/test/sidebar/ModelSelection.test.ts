import { fireEvent, render, screen } from '@testing-library/svelte';
import SetContextTest from '../testComponents/SetContextTest.svelte';
import ModelSelection from '@components/sidebar/ModelSelection.svelte';
import { panelKey } from '@store';
import type { CropWithPests, Pest } from '@types';

const data: CropWithPests[] = [
  {
    id: 1,
    name: 'corn',
    pests: [{ id: 11, name: 'bug' } as Pest],
  },
  {
    id: 2,
    name: 'carrots',
    pests: [
      { id: 21, name: 'ladybug' } as Pest,
      { id: 22, name: 'grasshopper' } as Pest,
      { id: 23, name: 'fly' } as Pest,
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
          getPestName: () => 'Disease',
        },
      },
    });
  });

  test('defaults crop and pest values to first in their respective lists', () => {
    expect(screen.getByTestId('crop-select')).toHaveValue('1');
    expect(screen.getByTestId('pest-select')).toHaveValue('11');
  });

  test('updates pests for selected crop', async () => {
    await fireEvent.change(screen.getByTestId('crop-select'), { target: { value: '2' } });
    expect(screen.getByTestId('pest-select')).toHaveValue('21');
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
          getPestName: () => 'Disease',
        },
      },
    });
  });

  test('renders empty select box', () => {
    expect(screen.getByTestId('crop-select'));
    expect(screen.getByTestId('pest-select'));
  });

  test('does not contain modal button', () => {
    expect(screen.queryByRole('button')).not.exist;
  });
});
