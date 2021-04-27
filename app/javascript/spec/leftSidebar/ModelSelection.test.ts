import ModelSelection from '../../src/components/leftSidebar/ModelSelection.svelte'
import { panelKey } from '../../src/store/store'
import { fireEvent, render } from '@testing-library/svelte'
import SetContextTest from '../testComponents/SetContextTest.svelte'

let data
let getRole
let getQuery
let getId

describe('when data present', () => {
  beforeEach(() => {
    data = [
      {
        id: 1,
        name: 'corn',
        afflictions: [
          { id: 11, name: 'bug' }
        ],
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
    ]

    const { getByRole, queryByRole, getByTestId } = render(SetContextTest, {
      props: {
        Component: ModelSelection,
        context_key: panelKey,
        context_value: {
          getCrops: () => data,
          getAfflictionName: () => 'Disease',
        },
      },
    })
    
    getRole = getByRole
    getQuery = queryByRole
    getId = getByTestId
  })

  it('defaults crop and affliction values to first in their respective lists', () => {
    expect(getId('crop-select')).toHaveValue('1')
    expect(getId('affliction-select')).toHaveValue('11')
  })

  it('updates afflictions for selected crop', async () => {
    await fireEvent.change(getId('crop-select'), { target: { value: '2' } })
    expect(getId('affliction-select')).toHaveValue('21')
  })

  it('shows modal when button is clicked', async () => {
    const button: HTMLElement = getRole('button')
    await fireEvent.click(button)
    expect(getRole('dialog', { name: 'bug' })).toBeInTheDocument()
  })

  it('closes the modal when close button is clicked', async () => {
    const button: HTMLElement = getRole('button')
    await fireEvent.click(button)
    await fireEvent.click(getRole('button', { name: 'Close' }))
    expect(getQuery('dialog', { name: 'bug' })).not.toBeInTheDocument()
  })
})

describe('when data not present', () => {
  beforeEach(() => {
    data = []

    const { getByRole, queryByRole, getByTestId } = render(SetContextTest, {
      props: {
        Component: ModelSelection,
        context_key: panelKey,
        context_value: {
          getCrops: () => data,
          getAfflictionName: () => 'Disease',
        },
      },
    })

    getRole = getByRole
    getQuery = queryByRole
    getId = getByTestId
  })

  it('renders empty select box', () => {
    expect(getId('crop-select')).toBeInTheDocument()
    expect(getId('affliction-select')).toBeInTheDocument()
  })

  it('does not contain modal button', () => {
    expect(getQuery('button')).not.toBeInTheDocument()
  })
})
