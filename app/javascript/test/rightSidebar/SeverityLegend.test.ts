import { render, screen } from '@testing-library/svelte';
import Color from 'color';

import SeverityLegend from '@components/rightSidebar/SeverityLegend.svelte';
import { severityColors } from '@ts/map/colors';

const severities = [
  { name: 'Very Low', slug: 'very_low', description: 'description' },
  { name: 'Low', slug: 'low', description: 'description' },
  { name: 'Medium', slug: 'medium', description: 'description' },
  { name: 'High', slug: 'high', description: 'description' },
  { name: 'Very High', slug: 'very_high', description: 'description' },
];

beforeEach(() => {
  render(SeverityLegend, {
    props: {
      severities: severities,
    },
  });
});

test('displays legend', () => {
  for (let severity of severities) {
    expect(screen.getByTestId('severity-level-' + severity.slug)).to.exist;
  }
});

// TODO: CSS not working in tests
test.skip('show the right severity colors', () => {
  for (let severity of severities) {
    const div = screen.getByTestId('severity-color-' + severity.slug);
    let expectedColor = Color(severityColors[severity.slug]).toString();
    expect(getComputedStyle(div)).toHaveProperty('background', expectedColor);
  }
});
