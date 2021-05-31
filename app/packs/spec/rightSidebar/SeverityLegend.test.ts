import SeverityLegend from '../../src/components/rightSidebar/SeverityLegend.svelte'
import { render } from '@testing-library/svelte'
import { mapMinMapMax } from '../../src/store/store'
import { tick } from 'svelte'

let getTitle
let legend

beforeEach(() => {
  const { getByTitle, component } = render(SeverityLegend, {
    props: {
      severities: [{ slug: 'slug', description: 'description', severity: '1' }],
    },
  })
  getTitle = getByTitle
  legend = component
})

it('displays legend', async () => {
  mapMinMapMax.set(null)
  await tick()
  expect(getTitle('severity-level')).toBeInTheDocument()
})
