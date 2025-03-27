import { render, screen } from '@testing-library/svelte';

import SetContextTest from '../SetContextTest.svelte';
import CustomModelSelection from '@components/sidebar/CustomModelSelection.svelte';
import { panelKey } from '@store';

const modelData = [
  {
    id: 1,
    name: 'Base 50.0°F',
    remote_name: 'dd_50_none',
    t_min: 50.0,
    t_max: null,
    name_c: 'Base 10.0°C',
  },
  {
    id: 2,
    name: 'Base 50.0°F, Upper 86.0°F',
    remote_name: 'dd_50_86',
    t_min: 50.0,
    t_max: 86.0,
    name_c: 'Base 10.0°C, Upper 30.0°C',
  },
];

describe('when data present', () => {
  beforeEach(() => {
    render(SetContextTest, {
      props: {
        Component: CustomModelSelection,
        context_key: panelKey,
        context_value: {
          getModels: () => modelData,
        },
      },
    });
  });

  test('defaults to the 50/86 degree day model', () => {
    expect(screen.getByText('Base 50.0°F, Upper 86.0°F')).toHaveValue('2');
  });
});

describe('when data not present', () => {
  beforeEach(() => {
    render(SetContextTest, {
      props: {
        Component: CustomModelSelection,
        context_key: panelKey,
        context_value: {
          getModels: () => [],
        },
      },
    });
  });

  test('renders empty select box', () => {
    let input = screen.getByRole('combobox', { name: 'Choose model' });
    expect(input).to.exist;
    expect(input.getAttribute('title')).toEqual('Select model');
    expect(input.innerHTML).toEqual('');
  });
});
