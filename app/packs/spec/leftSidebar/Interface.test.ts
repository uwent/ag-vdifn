import Interface from '../../src/components/leftSidebar/Interface.svelte'
import { fireEvent, render } from '@testing-library/svelte'
import { tick } from 'svelte'

let getRole
let getTestId

beforeEach(() => {
  const { getByRole, getByTestId } = render(Interface, {
    props: {
      diseasePanelData: [
        {
          id: 1,
          name: 'potato',
          afflictions: [
            { id: 5, name: 'late blight', t_min: 5, t_max: 10 },
            { id: 10, name: 'black death', t_min: 10, t_max: 100 },
          ],
        },
      ],
      insectPanelData: [
        {
          id: 1,
          name: 'potato',
          afflictions: [
            { id: 10, name: 'grasshopper' },
            { id: 45, name: 'caterpillar' },
          ],
        },
      ],
    },
  })
  getRole = getByRole
  getTestId = getByTestId
})

it('disease tab is selected by default', async () => {
  await tick()
  expect(getRole('radio', { name: 'Disease' }).checked).toEqual(true)
  expect(getTestId('disease-panel')).toBeInTheDocument()
  expect(getRole('combobox', { name: 'Disease' })).toBeInTheDocument()
})

it('shows insect panel when insect tab is selected', async () => {
  await tick()
  const insectTab = getRole('radio', { name: 'Insect' })
  await fireEvent.click(insectTab)
  expect(getTestId('insect-panel')).toBeInTheDocument()
  expect(getRole('combobox', { name: 'Insect' })).toBeInTheDocument()
})

it('shows custom panel when custom tab is selected', async () => {
  await tick()
  const customTab = getRole('radio', { name: 'Custom' })
  await fireEvent.click(customTab)
  expect(getTestId('custom-panel')).toBeInTheDocument()
})
