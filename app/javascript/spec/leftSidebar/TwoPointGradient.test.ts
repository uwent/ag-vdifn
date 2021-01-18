import TwoPointGradient from '../../src/components/leftSidebar/TwoPointGradient.svelte'
import { fireEvent, render } from '@testing-library/svelte'
import { mapMinMapMax, twoPointGradientState } from '../../src/store/store'
let getRole;
let queryTitle;
let addButton;
let minusButton;
let userMinInput: HTMLInputElement;
let userMaxInput: HTMLInputElement;
let updateOverlayButton: HTMLButtonElement;
let absoluteMaxDiv;
let absoluteMinDiv;
const absoluteMax = 800;
const absoluteMin = 300;
const severityLevels = 3;
describe("without save state", () => {
  beforeEach(() => {
    mapMinMapMax.set({ min: absoluteMin, max: absoluteMax })
    twoPointGradientState.set({ severityLevels: severityLevels})

    const { getByRole, queryAllByTitle, getByTitle, getByText } = render(TwoPointGradient)
    getRole = getByRole
    queryTitle = queryAllByTitle
    addButton = getRole("button", { name: "+" })
    minusButton = getRole("button", { name: "-" })
    userMinInput = getByTitle("userMin") as HTMLInputElement
    userMaxInput = getByTitle("userMax") as HTMLInputElement
    absoluteMaxDiv = getByTitle('absoluteMax')
    absoluteMinDiv = getByTitle('absoluteMin')
    updateOverlayButton = getByText('Update Overlay') as HTMLButtonElement
  })

  it('defaults to three severity levels', () => {
    expect(queryTitle("severity-row").length).toEqual(3)
  })

  it('adds and decrements severity levels', async () => {
    await fireEvent.click(addButton)
    await fireEvent.click(addButton)
    expect(queryTitle("severity-row").length).toEqual(5)

    await fireEvent.click(minusButton)
    await fireEvent.click(minusButton)

    expect(queryTitle("severity-row").length).toEqual(3)
  })

  it('cannot decrement when there are 3 severity levels', async () => {
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

  it('displays absolute min and absolute max', () => {
    expect(absoluteMinDiv.textContent).toEqual(`${absoluteMin}`)
    expect(absoluteMaxDiv.textContent).toEqual(`${absoluteMax}`)
  })

  // it('defaults userMin to 10 above absoluteMin and userMax 10 below absoluteMax', () => {
  //   expect(userMinInput.value).toEqual(`${absoluteMin + 10}`)
  //   expect(userMaxInput.value).toEqual(`${absoluteMax - 10}`)
  // })

  it('updates intermediate values when min input adjusted', async () => {
    const newMin = 400;
    await fireEvent.change(userMinInput, { target: { value: newMin } })
    expect(queryTitle("severity-row")[1].textContent).toEqual(` ${newMin} - ${Math.round(absoluteMax - (absoluteMax - absoluteMin) / (severityLevels * 2))}`)
  })

  it('updates intermediate values when max input adjusted', async () => {
    const newMax = 600;
    await fireEvent.change(userMaxInput, { target: { value: newMax } })
    expect(queryTitle("severity-row")[1].textContent).toEqual(` ${Math.round(absoluteMin + (absoluteMax - absoluteMin) / (severityLevels * 2))} - ${newMax}`)
  })

  it('adjusts multiple intermediate values', async () => {
    await fireEvent.click(addButton)
    await fireEvent.click(addButton)
    const newMin = 400;
    await fireEvent.change(userMinInput, { target: { value: newMin } })
    const newMax = 600;
    await fireEvent.change(userMaxInput, { target: { value: newMax } })

    expect(queryTitle("severity-row")[1].textContent).toEqual(" 400 - 466.7")
    expect(queryTitle("severity-row")[2].textContent).toEqual(" 466.7 - 533.4")
    expect(queryTitle("severity-row")[3].textContent).toEqual(" 533.4 - 600")
  })

  describe('validatations', () => {
    it('disables buttons when userMin is blank', async () => {
      const blank = "";
      await fireEvent.click(addButton)
      await fireEvent.change(userMinInput, { target: { value: blank } })

      expect(minusButton.disabled).toEqual(true)
      expect(addButton.disabled).toEqual(true)
      expect(updateOverlayButton.disabled).toEqual(true)
    })

    it('disables buttons when userMax is blank', async () => {
      const blank = "";
      await fireEvent.click(addButton)
      await fireEvent.change(userMaxInput, { target: { value: blank } })

      expect(minusButton.disabled).toEqual(true)
      expect(addButton.disabled).toEqual(true)
      expect(updateOverlayButton.disabled).toEqual(true)
    })

    it('disables buttons when userMin exceeds userMax', async () => {
      const newMin = absoluteMax - 5;
      await fireEvent.click(addButton)
      await fireEvent.change(userMinInput, { target: { value: newMin } })

      expect(minusButton.disabled).toEqual(true)
      expect(addButton.disabled).toEqual(true)
      expect(updateOverlayButton.disabled).toEqual(true)
      expect(userMinInput.validationMessage).toEqual("This value must be less than the chosen max and the map max")
    })

    it('disables buttons when userMin exceeds absoluteMax', async () => {
      const newMin = absoluteMax + 5;
      await fireEvent.click(addButton)
      await fireEvent.change(userMinInput, { target: { value: newMin } })

      expect(minusButton.disabled).toEqual(true)
      expect(addButton.disabled).toEqual(true)
      expect(updateOverlayButton.disabled).toEqual(true)
      expect(userMinInput.validationMessage).toEqual("This value must be less than the chosen max and the map max")
    })

    it('disables buttons when userMin is less than absoluteMin', async () => {
      const newMin = absoluteMin - 5;
      await fireEvent.click(addButton)
      await fireEvent.change(userMinInput, { target: { value: newMin } })

      expect(minusButton.disabled).toEqual(true)
      expect(addButton.disabled).toEqual(true)
      expect(updateOverlayButton.disabled).toEqual(true)
      expect(userMinInput.validationMessage).toEqual("This value must be greater than the map minimum")
    })

    it('disables buttons when userMax is less than userMin', async () => {
      const newMax = absoluteMin + 5;
      await fireEvent.click(addButton)
      await fireEvent.change(userMaxInput, { target: { value: newMax } })

      expect(minusButton.disabled).toEqual(true)
      expect(addButton.disabled).toEqual(true)
      expect(updateOverlayButton.disabled).toEqual(true)
      expect(userMaxInput.validationMessage).toEqual("This value must be greater than the chosen min and the map min")
    })

    it('disables buttons when userMax is less than absoluteMin', async () => {
      const newMax = absoluteMin - 5;
      await fireEvent.click(addButton)
      await fireEvent.change(userMaxInput, { target: { value: newMax } })

      expect(minusButton.disabled).toEqual(true)
      expect(addButton.disabled).toEqual(true)
      expect(updateOverlayButton.disabled).toEqual(true)
      expect(userMaxInput.validationMessage).toEqual("This value must be greater than the chosen min and the map min")
    })

    it('disables buttons when userMax is greater than absoluteMax', async () => {
      const newMax = absoluteMax + 5;
      await fireEvent.click(addButton)
      await fireEvent.change(userMaxInput, { target: { value: newMax } })

      expect(minusButton.disabled).toEqual(true)
      expect(addButton.disabled).toEqual(true)
      expect(updateOverlayButton.disabled).toEqual(true)
      expect(userMaxInput.validationMessage).toEqual("This value must be less than the map max")
    })

    it('enables bu†tons if input values are valid', async () => {
      let newMax = absoluteMax + 5;
      await fireEvent.click(addButton)
      await fireEvent.change(userMaxInput, { target: { value: newMax } })

      expect(minusButton.disabled).toEqual(true)
      expect(addButton.disabled).toEqual(true)
      expect(updateOverlayButton.disabled).toEqual(true)
      expect(userMaxInput.validationMessage).toEqual("This value must be less than the map max")

      newMax = 500;
      await fireEvent.change(userMaxInput, { target: { value: newMax } })
      expect(minusButton.disabled).toEqual(false)
      expect(addButton.disabled).toEqual(false)
      expect(updateOverlayButton.disabled).toEqual(false)
      expect(userMaxInput.validationMessage).toEqual("")
    })
  })
})


describe('saving valid state', () => {
  const userMinValue = 350;
  const userMaxValue = 650;
  const severityLevels = 5;
  beforeEach(() => {
    mapMinMapMax.set({ min: absoluteMin, max: absoluteMax })
    twoPointGradientState.set({absoluteMax: absoluteMax, absoluteMin: absoluteMin, userMin: userMinValue, userMax: userMaxValue, severityLevels: severityLevels})

    const { getByRole, queryAllByTitle, getByTitle, getByText } = render(TwoPointGradient)
    getRole = getByRole
    queryTitle = queryAllByTitle
    addButton = getRole("button", { name: "+" })
    minusButton = getRole("button", { name: "-" })
    userMinInput = getByTitle("userMin") as HTMLInputElement
    userMaxInput = getByTitle("userMax") as HTMLInputElement
    absoluteMaxDiv = getByTitle('absoluteMax')
    absoluteMinDiv = getByTitle('absoluteMin')
    updateOverlayButton = getByText('Update Overlay') as HTMLButtonElement
  })

  it('saves state', () => {
    expect(userMinInput.value).toEqual(userMinValue.toString())
    expect(userMaxInput.value).toEqual(userMaxValue.toString());
    expect(queryTitle("severity-row").length).toEqual(severityLevels)
  })
})

describe('saving invalid state', () => {
  const userMinValue = absoluteMin - 30;
  const userMaxValue = absoluteMax + 30;
  const severityLevels = 5;
  beforeEach(() => {
    mapMinMapMax.set({ min: absoluteMin, max: absoluteMax })
    twoPointGradientState.set({absoluteMin, absoluteMax, userMin: userMinValue, userMax: userMaxValue, severityLevels: severityLevels})

    const { getByRole, queryAllByTitle, getByTitle, getByText } = render(TwoPointGradient)
    getRole = getByRole
    queryTitle = queryAllByTitle
    addButton = getRole("button", { name: "+" })
    minusButton = getRole("button", { name: "-" })
    userMinInput = getByTitle("userMin") as HTMLInputElement
    userMaxInput = getByTitle("userMax") as HTMLInputElement
    absoluteMaxDiv = getByTitle('absoluteMax')
    absoluteMinDiv = getByTitle('absoluteMin')
    updateOverlayButton = getByText('Update Overlay') as HTMLButtonElement
  })

  it('saves state and disables buttons', () => {
    expect(userMinInput.value).toEqual(userMinValue.toString())
    expect(userMaxInput.value).toEqual(userMaxValue.toString());
    expect(queryTitle("severity-row").length).toEqual(severityLevels)
    expect(addButton.disabled).toEqual(true)
    expect(minusButton.disabled).toEqual(true)
    expect(updateOverlayButton.disabled).toEqual(true)
  })
})
