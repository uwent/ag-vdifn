import { render } from '@testing-library/svelte'
import { tick } from 'svelte'
import {
  selectedPanel,
  insectPanelState,
  diseasePanelState,
  customPanelState
} from '../../src/store/store'
import Status from '../../src/components/map/Status.svelte'

let getText

beforeEach(() => {
  const { getByText } = render(Status)
  getText = getByText
})

describe('when disease panel selected', () => {
  it('shows feedback when no model is submitted', async () => {
    selectedPanel.set('disease')
    await tick()
    expect(getText('No model submitted')).toBeInTheDocument()
  })

  it('shows current affliction name', async () => {
    selectedPanel.set('disease')
    diseasePanelState.set({ currentAffliction: { name: 'disease name' } })
    await tick()
    expect(getText('disease name')).toBeInTheDocument()
  })
})

describe('when insect panel selected', () => {
  it('shows feedback when no model is submitted', async () => {
    selectedPanel.set('insect')
    await tick()
    expect(getText('No model submitted')).toBeInTheDocument()
  })

  it('shows current affliction name', async () => {
    selectedPanel.set('insect')
    insectPanelState.set({ currentAffliction: { name: 'insect name' } })
    await tick()
    expect(getText('insect name')).toBeInTheDocument()
  })
})

describe('when custom panel selected', () => {
  it('shows Tmin and Tmax and temp units', async () => {
    selectedPanel.set('custom')
    customPanelState.set({
      loaded: true,
      params: { t_min: 5, t_max: 10, in_fahrenheit: true },
    })
    await tick()
    expect(getText('Degree day model: 5/10\u2109')).toBeInTheDocument()
  })
})
