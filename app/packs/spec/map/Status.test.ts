import { render } from '@testing-library/svelte'
import { tick } from 'svelte'
import {
  selectedPanel,
  panelNames,
  insectPanelState,
  diseasePanelState,
  customPanelState,
} from '../../src/store/store'
import Status from '../../src/components/map/Status.svelte'

let getText

beforeEach(() => {
  const { getByText } = render(Status)
  getText = getByText
})

describe('when insect panel selected', () => {
  it('shows feedback when no model is submitted', async () => {
    selectedPanel.set(panelNames.insect)
    await tick()
    expect(getText('No Model Submitted')).toBeInTheDocument()
  })

  it('shows current affliction name', async () => {
    selectedPanel.set(panelNames.insect)
    insectPanelState.set({ currentAffliction: { name: 'insect name' } })
    await tick()
    expect(getText('insect name')).toBeInTheDocument()
  })
})

describe('when disease panel selected', () => {
  it('shows feedback when no model is submitted', async () => {
    selectedPanel.set(panelNames.disease)
    await tick()
    expect(getText('No Model Submitted')).toBeInTheDocument()
  })

  it('shows current affliction name', async () => {
    selectedPanel.set(panelNames.disease)
    diseasePanelState.set({ currentAffliction: { name: 'disease name' } })
    await tick()
    expect(getText('disease name')).toBeInTheDocument()
  })
})

describe('when custom panel selected', () => {
  it('shows tMin and TMax and temp scale', async () => {
    selectedPanel.set(panelNames.custom)
    customPanelState.set({ t_min: 5, t_max: 10, in_fahrenheit: true })
    await tick()
    expect(getText('Custom model: 5/10 \u2109')).toBeInTheDocument()
  })
})
