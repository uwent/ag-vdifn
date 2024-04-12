import { render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';

import CustomSeverityLegend from '@components/rightSidebar/CustomSeverityLegend.svelte';

beforeEach(() => {
  render(CustomSeverityLegend, {
    props: {
      gradientMapping: [
        { color: 'green', number: 100 },
        { color: 'yellow', number: 200 },
        { color: 'orange', number: 300 },
        { color: 'red', number: Infinity },
      ],
    },
  });
});

test('displays legend', async () => {
  await tick();
  expect(screen.getByTestId('dsv-legend')).to.exist;
});

test('displays all the gradient levels', async () => {
  await tick();
  expect(screen.getAllByTestId('dsv-row').length).toEqual(4);
});

test('displays ranges on each row', async () => {
  await tick();
  let labels = screen.getAllByTestId('dsv-row');
  expect(labels[0].innerHTML).toContain('301+');
  expect(labels[1].innerHTML).toContain('201 - 300');
  expect(labels[2].innerHTML).toContain('101 - 200');
  expect(labels[3].innerHTML).toContain('0 - 100');
});

test('displays the correct colors', async () => {
  await tick();
  let colors = screen.getAllByTestId('dsv-color');
  expect(colors[0].style).toHaveProperty('background', 'red');
  expect(colors[1].style).toHaveProperty('background', 'orange');
  expect(colors[2].style).toHaveProperty('background', 'yellow');
  expect(colors[3].style).toHaveProperty('background', 'green');
});
