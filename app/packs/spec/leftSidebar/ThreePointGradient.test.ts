import ThreePointGradient from '../../src/components/leftSidebar/ThreePointGradient.svelte'
import { fireEvent, render } from '@testing-library/svelte'
import { mapMinMapMax, threePointGradientState } from '../../src/store/store'

let queryId
let userMinInput: HTMLInputElement
let userMiddleMinInput: HTMLInputElement
let userMiddleMaxInput: HTMLInputElement
let userMaxInput: HTMLInputElement
let addButton
let minusButton
let updateButton
let resetButton
let mapRange

const mapMin = 100
const mapMax = 1000
const defaultSeverityLevels = 5
const defaultSeverityRows = defaultSeverityLevels * 2 - 1

function to_tenths(x: number) {
  return Math.round(x * 10) / 10
}

describe('without save state', () => {
  beforeEach(() => {
    mapMinMapMax.set({ min: mapMin, max: mapMax })
    threePointGradientState.set({})

    const { queryAllByTestId, getByTitle, getByTestId } = render(ThreePointGradient)

    queryId = queryAllByTestId
    userMinInput = getByTestId('userMinInput') as HTMLInputElement
    userMiddleMinInput = getByTestId('userMiddleMinInput') as HTMLInputElement
    userMiddleMaxInput = getByTestId('userMiddleMaxInput') as HTMLInputElement
    userMaxInput = getByTestId('userMaxInput') as HTMLInputElement
    addButton = getByTestId('addButton')
    minusButton = getByTestId('minusButton')
    updateButton = getByTestId('updateButton')
    resetButton = getByTestId('resetButton')
    mapRange = getByTitle('Map range')
  })

  describe('sets up initial state', () => {
    it('displays map min and map max', () => {
      expect(mapRange.textContent).toContain(`${mapMin} - ${mapMax}`)
    })

    it('defaults to 5 severity levels', () => {
      expect(queryId('severity-row').length).toEqual(defaultSeverityRows)
    })

    it('starts with buttons enabled', () => {
      expect(addButton.disabled).toEqual(false)
      expect(updateButton.disabled).toEqual(false)
      expect(resetButton.disabled).toEqual(false)
      expect(minusButton.disabled).toEqual(false)
    })

    it('sets initial input values based on map range', () => {
      const x = (mapMax - mapMin) / (defaultSeverityRows)
      expect(userMinInput.value).toEqual(`${to_tenths(mapMin + x)}`)
      expect(userMiddleMinInput.value).toEqual(`${to_tenths((mapMin + mapMax) / 2 - x / 2)}`)
      expect(userMiddleMaxInput.value).toEqual(`${to_tenths((mapMin + mapMax) / 2 + x / 2)}`)
      expect(userMaxInput.value).toEqual(`${to_tenths(mapMax - x)}`)
    })

    it('generates intermediate values divided between min and middle min', async () => {
      const min = Number(userMinInput.value)
      const middleMin = Number(userMiddleMinInput.value)
      const x = (middleMin - min) / (defaultSeverityLevels - 2)
      expect(queryId('severity-row')[1].textContent).toEqual(` ${min} - ${to_tenths(min + x)}`)
      expect(queryId('severity-row')[2].textContent).toEqual(` ${min + x} - ${to_tenths(min + x * 2)}`)
    })

    it('generates intermediate values divided between middle max and max', async () => {
      const middleMax = Number(userMiddleMaxInput.value)
      const max = Number(userMaxInput.value)
      const x = to_tenths((max - middleMax) / (defaultSeverityLevels - 2))
      expect(queryId('severity-row')[defaultSeverityRows - 3].textContent).toEqual(` ${max - x * 2} - ${max - x}`)
      expect(queryId('severity-row')[defaultSeverityRows - 2].textContent).toEqual(` ${max - x} - ${max}`)
    })

  })
  
  describe('can change severity levels', () => {
    it('adds and decrements severity levels', async () => {
      await fireEvent.click(addButton)
      await fireEvent.click(addButton)
      expect(queryId('severity-row').length).toEqual(defaultSeverityRows + 4)
      await fireEvent.click(minusButton)
      await fireEvent.click(minusButton)
      expect(queryId('severity-row').length).toEqual(defaultSeverityRows)
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
      const min = Number(userMinInput.value)
      const middleMin = Number(userMiddleMinInput.value)
      const x = to_tenths((middleMin - min) / (defaultSeverityLevels - 2))
      expect(queryId('severity-row')[1].textContent).toEqual(` ${min} - ${min + x}`)

      await fireEvent.click(addButton)
      const newSeverityLevels = defaultSeverityLevels + 1
      const y = to_tenths((middleMin - min) / (newSeverityLevels - 2))
      expect(queryId('severity-row')[1].textContent).toEqual(` ${min} - ${min + y}`)
    })
  })

  describe('validates user values', () => {
    it('disables buttons when min is less than zero', async () => {
      const newMin = -1
      await fireEvent.change(userMinInput, { target: { value: newMin } })
      expect(userMinInput.validationMessage).toEqual('This value must be between 0 and the middle min')
      expect(userMiddleMinInput.validationMessage).toEqual('')
      expect(userMiddleMaxInput.validationMessage).toEqual('')
      expect(userMaxInput.validationMessage).toEqual('')
      expect(updateButton.disabled).toEqual(true)
    })

    it('disables buttons when min is greater than middle min', async () => {
      const newMin = Number(userMiddleMinInput.value) + 1
      await fireEvent.change(userMinInput, { target: { value: newMin } })
      expect(userMinInput.validationMessage).toEqual('This value must be between 0 and the middle min')
      expect(userMiddleMinInput.validationMessage).toEqual('This value must be between the min and middle max')
      expect(userMiddleMaxInput.validationMessage).toEqual('')
      expect(userMaxInput.validationMessage).toEqual('')
      expect(updateButton.disabled).toEqual(true)
    })

    it('disables buttons when middle min is less than the min', async () => {
      const newMiddleMin = Number(userMinInput.value) - 1
      await fireEvent.change(userMiddleMinInput, { target: { value: newMiddleMin } })
      expect(userMinInput.validationMessage).toEqual('This value must be between 0 and the middle min')
      expect(userMiddleMinInput.validationMessage).toEqual('This value must be between the min and middle max')
      expect(userMiddleMaxInput.validationMessage).toEqual('')
      expect(userMaxInput.validationMessage).toEqual('')
      expect(updateButton.disabled).toEqual(true)
    })

    it('disables buttons when middle min is greater than the middle max', async () => {
      const newMiddleMin = Number(userMiddleMaxInput.value) + 1
      await fireEvent.change(userMiddleMinInput, { target: { value: newMiddleMin } })
      expect(userMinInput.validationMessage).toEqual('')
      expect(userMiddleMinInput.validationMessage).toEqual('This value must be between the min and middle max')
      expect(userMiddleMaxInput.validationMessage).toEqual('This value must be between the middle min and the max')
      expect(userMaxInput.validationMessage).toEqual('')
      expect(updateButton.disabled).toEqual(true)
    })

    it('disables buttons when middle max is greater than the max', async () => {
      const newMiddleMax = Number(userMaxInput.value) + 1
      await fireEvent.change(userMiddleMaxInput, { target: { value: newMiddleMax } })
      expect(userMinInput.validationMessage).toEqual('')
      expect(userMiddleMinInput.validationMessage).toEqual('')
      expect(userMiddleMaxInput.validationMessage).toEqual('This value must be between the middle min and the max')
      expect(userMaxInput.validationMessage).toEqual('This value must be greater than the middle max')
      expect(updateButton.disabled).toEqual(true)
    })
  })

  describe('updates intermediate values when inputs change', () => {
    it('updates intermediate values when min changes', async () => {
      const min = Number(userMinInput.value)
      const middleMin = Number(userMiddleMinInput.value)
      const x = to_tenths((middleMin - min) / (defaultSeverityLevels - 2))
      expect(queryId('severity-row')[1].textContent).toEqual(` ${min} - ${min + x}`)

      const newMin = min - 100
      await fireEvent.change(userMinInput, { target: { value: newMin } })
      const y = to_tenths((middleMin - newMin) / (defaultSeverityLevels - 2))
      expect(queryId('severity-row')[1].textContent).toEqual(` ${newMin} - ${newMin + y}`)
    })

    it('updates intermediate values when middle min changes', async () => {
      const min = Number(userMinInput.value)
      const middleMin = Number(userMiddleMinInput.value)
      const x = to_tenths((middleMin - min) / (defaultSeverityLevels - 2))
      expect(queryId('severity-row')[1].textContent).toEqual(` ${min} - ${min + x}`)

      const newMiddleMin = middleMin - 100
      await fireEvent.change(userMiddleMinInput, { target: { value: newMiddleMin } })
      const y = to_tenths((newMiddleMin - min) / (defaultSeverityLevels - 2))
      expect(queryId('severity-row')[1].textContent).toEqual(` ${min} - ${min + y}`)
    })

    it('updates intermediate values when middle max changes', async () => {
      const middleMax = Number(userMiddleMaxInput.value)
      const max = Number(userMaxInput.value)
      const x = to_tenths((max - middleMax) / (defaultSeverityLevels - 2))
      expect(queryId('severity-row')[defaultSeverityRows - 2].textContent).toEqual(` ${max - x} - ${max}`)

      const newMiddleMax = middleMax + 150
      await fireEvent.change(userMiddleMaxInput, { target: { value: newMiddleMax } })
      const y = to_tenths((max - newMiddleMax) / (defaultSeverityLevels - 2))
      expect(queryId('severity-row')[defaultSeverityRows - 2].textContent).toEqual(` ${max - y} - ${max}`)
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
  const severityLevels = 6
  const userValues = [250, 350, 450, 550]

  beforeEach(() => {
    mapMinMapMax.set({ min: mapMin, max: mapMax })
    threePointGradientState.set({
      severityLevels: severityLevels,
      userValues: userValues,
      mapMin: mapMin,
      mapMax: mapMax,
    })

    const { queryAllByTestId, getByTestId } = render(ThreePointGradient)

    queryId = queryAllByTestId
    userMinInput = getByTestId('userMinInput') as HTMLInputElement
    userMiddleMinInput = getByTestId('userMiddleMinInput') as HTMLInputElement
    userMiddleMaxInput = getByTestId('userMiddleMaxInput') as HTMLInputElement
    userMaxInput = getByTestId('userMaxInput') as HTMLInputElement
  })

  it('saves state', () => {
    expect(userMinInput.value).toEqual(userValues[0].toString())
    expect(userMiddleMinInput.value).toEqual(userValues[1].toString())
    expect(userMiddleMaxInput.value).toEqual(userValues[2].toString())
    expect(userMaxInput.value).toEqual(userValues[3].toString())
    expect(queryId('severity-row').length).toEqual(defaultSeverityRows + 2)
  })
})

