import TwoPointGradient from '../../src/components/leftSidebar/TwoPointGradient.svelte'
import { fireEvent, render } from '@testing-library/svelte'
import { mapMinMapMax, twoPointGradientState } from '../../src/store/store'

let queryId
let userMinInput: HTMLInputElement
let userMaxInput: HTMLInputElement
let addButton
let minusButton
let updateButton
let resetButton
let mapRange

const mapMin = 300
const mapMax = 800
const defaultSeverityLevels = 5

function to_tenths(x: number) {
  return Math.round(x * 10) / 10
}

describe('without save state', () => {
  beforeEach(() => {
    mapMinMapMax.set({ min: mapMin, max: mapMax })
    twoPointGradientState.set({})

    const { queryAllByTestId, getByTitle, getByTestId } = render(TwoPointGradient)

    queryId = queryAllByTestId
    userMinInput = getByTestId('userMinInput') as HTMLInputElement
    userMaxInput = getByTestId('userMaxInput') as HTMLInputElement
    addButton = getByTestId('addButton')
    minusButton = getByTestId('minusButton')
    updateButton = getByTestId('updateButton')
    resetButton = getByTestId('resetButton')
    mapRange = getByTitle('Map range')
  })

  describe('sets up in initial state', () => {
    it('displays map min and map max', () => {
      expect(mapRange.textContent).toContain(`${mapMin} - ${mapMax}`)
    })

    it('defaults to 5 severity levels', () => {
      expect(queryId('severity-row').length).toEqual(defaultSeverityLevels)
    })

    it('starts with buttons enabled', () => {
      expect(addButton.disabled).toEqual(false)
      expect(updateButton.disabled).toEqual(false)
      expect(resetButton.disabled).toEqual(false)
      expect(minusButton.disabled).toEqual(false)
    })

    it('sets initial input values based on map range', () => {
      const x = to_tenths((mapMax - mapMin) / defaultSeverityLevels)
      expect(userMinInput.value).toEqual(`${mapMin + x}`)
      expect(userMaxInput.value).toEqual(`${mapMax - x}`)
    })

    it('generates intermediate values divided between userMin and userMax', async () => {
      const userMin = Number(userMinInput.value)
      const userMax = Number(userMaxInput.value)
      const x = to_tenths((userMax - userMin) / (defaultSeverityLevels - 2))
      expect(queryId('severity-row')[1].textContent).toEqual(
        ` ${userMin} - ${userMin + x}`
      )
    })
  })

  describe('can change severity levels', () => {
    it('adds and decrements severity levels', async () => {
      await fireEvent.click(addButton)
      await fireEvent.click(addButton)
      expect(queryId('severity-row').length).toEqual(7)
      await fireEvent.click(minusButton)
      await fireEvent.click(minusButton)
      expect(queryId('severity-row').length).toEqual(5)
    })

    it('cannot decrement when there are 3 severity levels', async () => {
      await fireEvent.click(minusButton)
      await fireEvent.click(minusButton)
      expect(minusButton.disabled).toEqual(true)
    })

    it('cannot add when there are 8 levels', async () => {
      await fireEvent.click(addButton)
      await fireEvent.click(addButton)
      await fireEvent.click(addButton)
      expect(addButton.disabled).toEqual(true)
    })

    it('updates intermediate values when severity levels change', async () => {
      const userMin = Number(userMinInput.value)
      const userMax = Number(userMaxInput.value)
      const x = to_tenths((userMax - userMin) / (defaultSeverityLevels - 2))
      expect(queryId('severity-row')[1].textContent).toEqual(
        ` ${userMin} - ${userMin + x}`
      )
      await fireEvent.click(addButton)
      const severityLevels = defaultSeverityLevels + 1
      const y = to_tenths((userMax - userMin) / (severityLevels - 2))
      expect(queryId('severity-row')[1].textContent).toEqual(
        ` ${userMin} - ${userMin + y}`
      )
    })
  })

  describe('validates user min and max values', () => {
    it('disables buttons when min is less than zero', async () => {
      const newMin = -10
      await fireEvent.change(userMinInput, { target: { value: newMin } })
      expect(userMinInput.validationMessage).toEqual(
        'This value must be between 0 and the maximum'
      )
      expect(userMaxInput.validationMessage).toEqual('')
      expect(updateButton.disabled).toEqual(true)
    })

    it('disables buttons when min is greater than max', async () => {
      const newMin = 1000
      await fireEvent.change(userMinInput, { target: { value: newMin } })
      expect(userMinInput.validationMessage).toEqual(
        'This value must be between 0 and the maximum'
      )
      expect(userMaxInput.validationMessage).toEqual(
        'This value must be greater than the minimum'
      )
      expect(updateButton.disabled).toEqual(true)
    })

    it('disables buttons when min is greater than max', async () => {
      const newMax = -10
      await fireEvent.change(userMaxInput, { target: { value: newMax } })
      expect(userMinInput.validationMessage).toEqual(
        'This value must be between 0 and the maximum'
      )
      expect(userMaxInput.validationMessage).toEqual(
        'This value must be greater than the minimum'
      )
      expect(updateButton.disabled).toEqual(true)
    })
  })

  describe('updates intermediate values when user inputs change', () => {
    it('updates intermediate values when userMin is changed', async () => {
      const newMin = 200
      const userMax = Number(userMaxInput.value)
      await fireEvent.change(userMinInput, { target: { value: newMin } })
      const x = to_tenths((userMax - newMin) / (defaultSeverityLevels - 2))
      expect(queryId('severity-row')[1].textContent).toEqual(` ${newMin} - ${newMin + x}`)
    })

    it('updates intermediate values when userMax is changed', async () => {
      const newMax = 1000
      const userMin = Number(userMinInput.value)
      await fireEvent.change(userMaxInput, { target: { value: newMax } })
      const x = to_tenths((newMax - userMin) / (defaultSeverityLevels - 2))
      expect(queryId('severity-row')[defaultSeverityLevels - 2].textContent).toEqual(
        ` ${newMax - x} - ${newMax}`
      )
    })
  })

  describe('resets user values', () => {
    it('resets values to default when reset is pushed', async () => {
      const oldMax = userMaxInput.value
      const newMax = 1000
      await fireEvent.change(userMaxInput, { target: { value: newMax } })
      expect(userMaxInput.value).toEqual(newMax.toString())
      await fireEvent.click(resetButton)
      expect(userMaxInput.value).toEqual(oldMax)
    })
  })
})

describe('saving valid state', () => {
  const severityLevels = 4
  const userValues = [350, 650]

  beforeEach(() => {
    mapMinMapMax.set({ min: mapMin, max: mapMax })
    twoPointGradientState.set({
      severityLevels: severityLevels,
      userValues: userValues,
      mapMax: mapMax,
      mapMin: mapMin
    })

    const { queryAllByTestId, getByTestId } = render(TwoPointGradient)

    queryId = queryAllByTestId
    userMinInput = getByTestId('userMinInput') as HTMLInputElement
    userMaxInput = getByTestId('userMaxInput') as HTMLInputElement
  })

  it('saves state', () => {
    expect(userMinInput.value).toEqual(userValues[0].toString())
    expect(userMaxInput.value).toEqual(userValues[1].toString())
    expect(queryId('severity-row').length).toEqual(severityLevels)
  })
})
