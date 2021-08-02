import SeverityLegend from '../../src/components/rightSidebar/SeverityLegend.svelte'
import { severityColors } from '../../src/components/common/ts/colors'
import { render } from '@testing-library/svelte'
import { mapMinMapMax } from '../../src/store/store'
import { tick } from 'svelte'
import Color from 'color'

let getTestId
let legend
let severity

const severities = [
  { name: 'Very Low', slug: 'very_low', description: 'description' },
  { name: 'Low', slug: 'low', description: 'description' },
  { name: 'Medium', slug: 'medium', description: 'description' },
  { name: 'High', slug: 'high', description: 'description' },
  { name: 'Very High', slug: 'very_high', description: 'description' }
]

beforeEach(() => {
  const { getByTestId, component } = render(SeverityLegend, {
    props: {
      severities: severities
    },
  })
  getTestId = getByTestId
  legend = component
})

it('displays legend', async () => {
  mapMinMapMax.set(null)
  await tick()
  for (severity of severities) {
    expect(getTestId('severity-level-' + severity.slug)).toBeInTheDocument()
  }
})

it('show the right severity colors', async () => {
  mapMinMapMax.set(null)
  await tick()
  for (severity of severities) {
    let div = getTestId('severity-color-' + severity.slug)
    let expectedColor = Color(severityColors[severity.slug]).toString()
    expect(getComputedStyle(div)).toHaveProperty('background', expectedColor)
  }
})
