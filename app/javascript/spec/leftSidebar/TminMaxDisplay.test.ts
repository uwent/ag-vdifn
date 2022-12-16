import { fireEvent, render } from '@testing-library/svelte'
import { tick } from 'svelte'
import TminMaxDisplay from '../../src/components/leftSidebar/TminMaxDisplay.svelte'
import SetContextTest from '../testComponents/SetContextTest.svelte'
import { c_to_f, f_to_c } from '../../src/components/common/ts/utils'
import {
  panelKey,
  selectedPanel,
  selectedAffliction,
  selectedDDModel,
} from '../../src/store/store'

const disease = { id: 1, name: 'disease', t_min: null, t_max: null }
const bug1 = { id: 2, name: 'bug1', t_min: 50, t_max: 86 }
const bug2 = { id: 3, name: 'bug2', t_min: 42, t_max: null }
const dd1 = { id: 4, name: 'Base 50/86', name_c: 'Base 10/30', t_min: 50, t_max: 86 }
const dd2 = { id: 5, name: 'Base 50', name_c: 'Base 10', t_min: 50, t_max: null }
const cropData = [
  { id: 1, name: 'corn', afflictions: [disease, bug1] },
  { id: 2, name: 'carrots', afflictions: [disease, bug2] }
]
const ddData = [dd1, dd2]

let minText
let maxText
let tempToggle

describe('Temperature conversion helpers', () => {
  it('converts c to f correctly', () => {
    expect(c_to_f(undefined)).toEqual(undefined)
    expect(c_to_f(null)).toEqual(null)
    expect(c_to_f(0)).toEqual(32)
    expect(c_to_f(-40)).toEqual(-40)
    expect(c_to_f(37)).toEqual(98.6)
  })

  it('converts f to c correctly', () => {
    expect(f_to_c(undefined)).toEqual(undefined)
    expect(f_to_c(null)).toEqual(null)
    expect(f_to_c(32)).toEqual(0)
    expect(f_to_c(-40)).toEqual(-40)
    expect(f_to_c(85)).toEqual(29.4)
  })
})

describe('TminMaxDisplay component for disease/insect', () => {
  beforeEach(() => {
    const { getByTitle } = render(SetContextTest, {
      props: {
        Component: TminMaxDisplay,
        context_key: panelKey,
        context_value: {
          panelType: 'disease',
          getCrops: () => cropData,
        }
      }
    })
    minText = getByTitle('Min temp')
    maxText = getByTitle('Max temp')
    tempToggle = getByTitle('temp-unit-toggle') as HTMLInputElement
  })

  it('shows min/max temps for disease panel', async () => {
    expect(minText).toHaveTextContent('None')
    expect(maxText).toHaveTextContent('None')
  })

  it('shows min/max temps for insect panel', async () => {
    selectedPanel.set('insect')
    selectedAffliction.set(bug1)
    await tick()
    expect(minText).toHaveTextContent(`${bug1.t_min}`)
    expect(maxText).toHaveTextContent(`${bug1.t_max}`)

    selectedAffliction.set(bug2)
    await tick()
    expect(minText).toHaveTextContent(`${bug2.t_min}`)
    expect(maxText).toHaveTextContent('None')
  })

  it('converts values between celcius and fahrenheit when temp unit is toggled', async () => {
    selectedPanel.set('insect')
    selectedAffliction.set(bug1)
    await tick()

    expect(minText).toHaveTextContent(`${bug1.t_min}`)
    expect(maxText).toHaveTextContent(`${bug1.t_max}`)

    await fireEvent.click(tempToggle)
    expect(tempToggle.checked).toEqual(false)
    expect(minText).toHaveTextContent(`${f_to_c(bug1.t_min)}`)
    expect(maxText).toHaveTextContent(`${f_to_c(bug1.t_max)}`)

    await fireEvent.click(tempToggle)
    expect(tempToggle.checked).toEqual(true)
    expect(minText).toHaveTextContent(`${bug1.t_min}`)
    expect(maxText).toHaveTextContent(`${bug1.t_max}`)
  })

  it('defaults temp to fahrenheit', () => {
    expect(tempToggle.checked).toEqual(true)
  })
})


describe('TminMaxDisplay component for custom panel', () => {
  beforeEach(() => {
    const { getByTitle } = render(SetContextTest, {
      props: {
        Component: TminMaxDisplay,
        context_key: panelKey,
        context_value: {
          panelType: 'custom',
          getModels: () => ddData,
        }
      }
    })
    minText = getByTitle('Min temp')
    maxText = getByTitle('Max temp')
    tempToggle = getByTitle('temp-unit-toggle') as HTMLInputElement
  })

  it('shows min/max temps for custom panel', async () => {
    selectedDDModel.set(dd1)
    await tick()
    expect(minText).toHaveTextContent(`${dd1.t_min}`)
    expect(maxText).toHaveTextContent(`${dd1.t_max}`)

    selectedDDModel.set(dd2)
    await tick()
    expect(minText).toHaveTextContent(`${dd2.t_min}`)
    expect(maxText).toHaveTextContent('None')
  })

  it('defaults temp to fahrenheit', () => {
    expect(tempToggle.checked).toEqual(true)
  })

  it('converts values between celcius and fahrenheit when temp unit is toggled', async () => {
    selectedDDModel.set(dd1)

    await fireEvent.click(tempToggle)
    expect(tempToggle.checked).toEqual(false)
    expect(minText).toHaveTextContent(`${f_to_c(dd1.t_min)}`)
    expect(maxText).toHaveTextContent(`${f_to_c(dd1.t_max)}`)

    await fireEvent.click(tempToggle)
    expect(tempToggle.checked).toEqual(true)
    expect(minText).toHaveTextContent(`${dd1.t_min}`)
    expect(maxText).toHaveTextContent(`${dd1.t_max}`)
  })
})
