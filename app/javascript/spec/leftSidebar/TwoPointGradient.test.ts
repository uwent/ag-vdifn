import TwoPointGradient from '../../src/components/leftSidebar/TwoPointGradient.svelte'
import { fireEvent, queryAllByTestId, render } from '@testing-library/svelte'
import { mapMinMapMax, twoPointGradientState } from '../../src/store/store'

let getRole
let getID
let queryTitle
let queryId
let addButton
let minusButton
let userMinInput: HTMLInputElement
let userMaxInput: HTMLInputElement
let updateOverlayButton
let resetOverlayButton
let mapRangeDiv

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

    const { getByRole, queryAllByTitle, queryAllByTestId, getByTitle, getByText, getByTestId } = render(TwoPointGradient)
    queryId = queryAllByTestId
    userMinInput = getByTestId('userMinInput') as HTMLInputElement
    userMaxInput = getByTestId('userMaxInput') as HTMLInputElement
    addButton = getByTestId('plusButton')
    minusButton = getByTestId('minusButton')
    updateOverlayButton = getByTestId('updateButton')
    resetOverlayButton = getByTestId('resetButton')
    mapRangeDiv = getByTitle('Map range')
  })

  it('displays map min and map max', () => {
    expect(mapRangeDiv.textContent).toContain(`${mapMin} - ${mapMax}`)
  })

  it('defaults to 5 severity levels', () => {
    expect(queryId('severity-row').length).toEqual(defaultSeverityLevels)
  })

  it('defaults userMin and userMax to evenly divided between mapMin and mapMax', () => {
    const x = (mapMax - mapMin) / (defaultSeverityLevels)
    expect(userMinInput.value).toEqual(`${to_tenths(mapMin + x)}`)
    expect(userMaxInput.value).toEqual(`${to_tenths(mapMax - x)}`)
  })

  it('generates intermediate values divided between userMin and userMax', async () => {
    const userMin = Number(userMinInput.value)
    const userMax = Number(userMaxInput.value)
    const x = (userMax - userMin) / (defaultSeverityLevels - 2)
    expect(queryId('severity-row')[1].textContent).toEqual(
      ` ${userMin} - ${to_tenths(userMin + x)}`,
    )
  })

  it('updates intermediate values when userMin is changed', async () => {
    const newMin = 200
    await fireEvent.change(userMinInput, { target: { value: newMin } })
    const x = (Number(userMaxInput.value) - newMin) / (defaultSeverityLevels - 2)
    expect(queryId('severity-row')[1].textContent).toEqual(
      ` ${newMin} - ${to_tenths(newMin + x)}`,
    )
  })

  it('updates intermediate values when userMax is changed', async () => {
    const newMax = 1000
    const userMin = Number(userMinInput.value)
    await fireEvent.change(userMaxInput, { target: { value: newMax } })
    const x = (newMax - userMin) / (defaultSeverityLevels - 2)
    expect(queryId('severity-row')[defaultSeverityLevels - 2].textContent).toEqual(
      ` ${to_tenths(newMax - x)} - ${newMax}`,
    )
  })

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
    await fireEvent.click(addButton)
    await fireEvent.click(addButton)
    expect(addButton.disabled).toEqual(true)
  })

  it('updates intermediate values when severity levels change', async () => {
    const severityLevels = queryId('severity-row').length
    const userMin = Number(userMinInput.value)
    const userMax = Number(userMaxInput.value)
    const x = (userMax - userMin) / (severityLevels - 2)
    expect(queryId('severity-row')[1].textContent).toEqual(
      ` ${userMin} - ${to_tenths(userMin + x)}`,
    )
    expect(queryId('severity-row')[severityLevels - 2].textContent).toEqual(
      ` ${to_tenths(userMax - x)} - ${userMax}`,
    )
  })

  // describe('validatations', () => {
  //   it('disables buttons when userMin is blank', async () => {
  //     const blank = ''
  //     await fireEvent.click(addButton)
  //     await fireEvent.change(userMinInput, { target: { value: blank } })

  //     expect(minusButton.disabled).toEqual(true)
  //     expect(addButton.disabled).toEqual(true)
  //     expect(updateOverlayButton.disabled).toEqual(true)
  //   })

  //   it('disables buttons when userMax is blank', async () => {
  //     const blank = ''
  //     await fireEvent.click(addButton)
  //     await fireEvent.change(userMaxInput, { target: { value: blank } })

  //     expect(minusButton.disabled).toEqual(true)
  //     expect(addButton.disabled).toEqual(true)
  //     expect(updateOverlayButton.disabled).toEqual(true)
  //   })

  //   it('disables buttons when userMin exceeds userMax', async () => {
  //     const newMin = absoluteMax - 5
  //     await fireEvent.click(addButton)
  //     await fireEvent.change(userMinInput, { target: { value: newMin } })

  //     expect(minusButton.disabled).toEqual(true)
  //     expect(addButton.disabled).toEqual(true)
  //     expect(updateOverlayButton.disabled).toEqual(true)
  //     expect(userMinInput.validationMessage).toEqual(
  //       'This value must be less than the chosen max and the map max',
  //     )
  //   })

  //   it('disables buttons when userMin exceeds absoluteMax', async () => {
  //     const newMin = absoluteMax + 5
  //     await fireEvent.click(addButton)
  //     await fireEvent.change(userMinInput, { target: { value: newMin } })

  //     expect(minusButton.disabled).toEqual(true)
  //     expect(addButton.disabled).toEqual(true)
  //     expect(updateOverlayButton.disabled).toEqual(true)
  //     expect(userMinInput.validationMessage).toEqual(
  //       'This value must be less than the chosen max and the map max',
  //     )
  //   })

  //   it('disables buttons when userMin is less than absoluteMin', async () => {
  //     const newMin = absoluteMin - 5
  //     await fireEvent.click(addButton)
  //     await fireEvent.change(userMinInput, { target: { value: newMin } })

  //     expect(minusButton.disabled).toEqual(true)
  //     expect(addButton.disabled).toEqual(true)
  //     expect(updateOverlayButton.disabled).toEqual(true)
  //     expect(userMinInput.validationMessage).toEqual(
  //       'This value must be greater than the map minimum',
  //     )
  //   })

  //   it('disables buttons when userMax is less than userMin', async () => {
  //     const newMax = absoluteMin + 5
  //     await fireEvent.click(addButton)
  //     await fireEvent.change(userMaxInput, { target: { value: newMax } })

  //     expect(minusButton.disabled).toEqual(true)
  //     expect(addButton.disabled).toEqual(true)
  //     expect(updateOverlayButton.disabled).toEqual(true)
  //     expect(userMaxInput.validationMessage).toEqual(
  //       'This value must be greater than the chosen min and the map min',
  //     )
  //   })

  //   it('disables buttons when userMax is less than absoluteMin', async () => {
  //     const newMax = absoluteMin - 5
  //     await fireEvent.click(addButton)
  //     await fireEvent.change(userMaxInput, { target: { value: newMax } })

  //     expect(minusButton.disabled).toEqual(true)
  //     expect(addButton.disabled).toEqual(true)
  //     expect(updateOverlayButton.disabled).toEqual(true)
  //     expect(userMaxInput.validationMessage).toEqual(
  //       'This value must be greater than the chosen min and the map min',
  //     )
  //   })

  //   it('disables buttons when userMax is greater than absoluteMax', async () => {
  //     const newMax = absoluteMax + 5
  //     await fireEvent.click(addButton)
  //     await fireEvent.change(userMaxInput, { target: { value: newMax } })

  //     expect(minusButton.disabled).toEqual(true)
  //     expect(addButton.disabled).toEqual(true)
  //     expect(updateOverlayButton.disabled).toEqual(true)
  //     expect(userMaxInput.validationMessage).toEqual(
  //       'This value must be less than the map max',
  //     )
  //   })

  //   it('enables bu†tons if input values are valid', async () => {
  //     let newMax = absoluteMax + 5
  //     await fireEvent.click(addButton)
  //     await fireEvent.change(userMaxInput, { target: { value: newMax } })

  //     expect(minusButton.disabled).toEqual(true)
  //     expect(addButton.disabled).toEqual(true)
  //     expect(updateOverlayButton.disabled).toEqual(true)
  //     expect(userMaxInput.validationMessage).toEqual(
  //       'This value must be less than the map max',
  //     )

  //     newMax = 500
  //     await fireEvent.change(userMaxInput, { target: { value: newMax } })
  //     expect(minusButton.disabled).toEqual(false)
  //     expect(addButton.disabled).toEqual(false)
  //     expect(updateOverlayButton.disabled).toEqual(false)
  //     expect(userMaxInput.validationMessage).toEqual('')
  //   })
  // })
})

// describe('saving valid state', () => {
//   const userMinValue = 350
//   const userMaxValue = 650
//   const severityLevels = 5
//   beforeEach(() => {
//     mapMinMapMax.set({ min: absoluteMin, max: absoluteMax })
//     twoPointGradientState.set({
//       absoluteMax: absoluteMax,
//       absoluteMin: absoluteMin,
//       userMin: userMinValue,
//       userMax: userMaxValue,
//       severityLevels: severityLevels,
//     })

//     const { getByRole, queryAllByTitle, getByTitle, getByText } = render(
//       TwoPointGradient,
//     )
//     getRole = getByRole
//     queryTitle = queryAllByTitle
//     addButton = getRole('button', { name: '+' })
//     minusButton = getRole('button', { name: '-' })
//     userMinInput = getByTitle('userMin') as HTMLInputElement
//     userMaxInput = getByTitle('userMax') as HTMLInputElement
//     absoluteMaxDiv = getByTitle('absoluteMax')
//     absoluteMinDiv = getByTitle('absoluteMin')
//     updateOverlayButton = getByText('Update Overlay') as HTMLButtonElement
//   })

//   it('saves state', () => {
//     expect(userMinInput.value).toEqual(userMinValue.toString())
//     expect(userMaxInput.value).toEqual(userMaxValue.toString())
//     expect(queryTitle('severity-row').length).toEqual(severityLevels)
//   })
// })

// describe('saving invalid state', () => {
//   const userMinValue = absoluteMin - 30
//   const userMaxValue = absoluteMax + 30
//   const severityLevels = 5
//   beforeEach(() => {
//     mapMinMapMax.set({ min: absoluteMin, max: absoluteMax })
//     twoPointGradientState.set({
//       absoluteMin,
//       absoluteMax,
//       userMin: userMinValue,
//       userMax: userMaxValue,
//       severityLevels: severityLevels,
//     })

//     const { getByRole, queryAllByTitle, getByTitle, getByText } = render(
//       TwoPointGradient,
//     )
//     getRole = getByRole
//     queryTitle = queryAllByTitle
//     addButton = getRole('button', { name: '+' })
//     minusButton = getRole('button', { name: '-' })
//     userMinInput = getByTitle('userMin') as HTMLInputElement
//     userMaxInput = getByTitle('userMax') as HTMLInputElement
//     absoluteMaxDiv = getByTitle('absoluteMax')
//     absoluteMinDiv = getByTitle('absoluteMin')
//     updateOverlayButton = getByText('Update Overlay') as HTMLButtonElement
//   })

//   it('saves state and disables buttons', () => {
//     expect(userMinInput.value).toEqual(userMinValue.toString())
//     expect(userMaxInput.value).toEqual(userMaxValue.toString())
//     expect(queryTitle('severity-row').length).toEqual(severityLevels)
//     expect(addButton.disabled).toEqual(true)
//     expect(minusButton.disabled).toEqual(true)
//     expect(updateOverlayButton.disabled).toEqual(true)
//   })
// })
