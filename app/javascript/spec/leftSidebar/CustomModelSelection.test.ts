import CustomModelSelection from '../../src/components/leftSidebar/CustomModelSelection.svelte'
import { panelKey } from '../../src/store/store'
import { fireEvent, render } from '@testing-library/svelte'
import SetContextTest from '../testComponents/SetContextTest.svelte'

let data
let getRole
let getQuery

describe('when data present', () => {
  beforeEach(() => {
    data = [
      {
        id: 1,
        name: 'corn',
        afflictions: [
          { id: 11, name: 'bug', t_min: 50, t_max: 86 },
          { id: 12, name: 'beetle', t_min: 40, t_max: null }
        ]
      },
      {
        id: 2,
        name: 'carrots',
        afflictions: [
          { id: 21, name: 'ladybug' },
          { id: 22, name: 'fly' }
        ]
      }
    ]

    const { getByRole, queryByRole } = render(SetContextTest, {
      props: {
        Component: CustomModelSelection,
        context_key: panelKey,
        context_value: {
          getCrops: () => data,
          getAfflictionName: () => 'Model'
        }
      }
    })
    getRole = getByRole
    getQuery = queryByRole
  })

  it('defaults crop and affliction values to first in their respective lists', () => {
    expect(getRole('combobox', { name: 'Crop' })).toHaveValue('1')
    expect(getRole('combobox', { name: 'Model' })).toHaveValue('11')
  })

  it('updates afflictions for selected crop', async () => {
    const select: HTMLElement = getRole('combobox', { name: 'Crop' })
    await fireEvent.change(select, { target: { value: '2' } })
    expect(getRole('combobox', { name: 'Model' })).toHaveValue('21')
  })

  it('shows tmin and tmax in the model selection box', () => {
    expect(getRole('combobox', { name: 'Model' })).toHaveTextContent('bug')
    expect(getRole('combobox', { name: 'Model' })).toHaveTextContent('(50/86')
    expect(getRole('combobox', { name: 'Model' })).toHaveTextContent('beetle')
    expect(getRole('combobox', { name: 'Model' })).toHaveTextContent('(40/None')
  })
})

describe('when data not present', () => {
  beforeEach(() => {
    data = []

    const { getByRole, queryByRole } = render(SetContextTest, {
      props: {
        Component: CustomModelSelection,
        context_key: panelKey,
        context_value: {
          getCrops: () => data,
          getAfflictionName: () => 'Model'
        }
      }
    })
    getRole = getByRole
    getQuery = queryByRole
  })

  it('renders empty select box', () => {
    expect(getRole('combobox', { name: 'Crop' })).toBeInTheDocument()
    expect(getRole('combobox', { name: 'Model' })).toBeInTheDocument()
  })
})
