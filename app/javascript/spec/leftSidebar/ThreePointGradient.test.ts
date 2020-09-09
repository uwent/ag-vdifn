import ThreePointGradient from '../../src/components/leftSidebar/ThreePointGradient.svelte'
import { fireEvent, render } from '@testing-library/svelte'
import { mapMinMapMax, threePointGradientState } from '../../src/store/store'
let getRole;
let queryTitle;
let addButton;
let minusButton;
let userMinInput: HTMLInputElement;
let userMaxInput: HTMLInputElement;
let userMiddleInputMin: HTMLInputElement;
let userMiddleInputMax: HTMLInputElement;
let updateOverlayButton: HTMLButtonElement;
let absoluteMaxDiv;
let absoluteMinDiv;
const absoluteMax = 800;
const absoluteMin = 300;
const defaultMiddleMin = 540;
const defaultMiddleMax = 560; 
describe("without save state", () => {
    beforeEach(() => {
        mapMinMapMax.set({ min: absoluteMin, max: absoluteMax })
        threePointGradientState.set({})
    
        const { getByRole, queryAllByTitle, getByTitle, getByText } = render(ThreePointGradient)
        getRole = getByRole
        queryTitle = queryAllByTitle
        addButton = getRole("button", { name: "+" })
        minusButton = getRole("button", { name: "-" })
        userMinInput = getByTitle("userMin") as HTMLInputElement
        userMaxInput = getByTitle("userMax") as HTMLInputElement
        userMiddleInputMin = getByTitle("userMiddleMin") as HTMLInputElement
        userMiddleInputMax = getByTitle("userMiddleMax") as HTMLInputElement
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

        expect(queryTitle("severity-row").length).toEqual(7)
    
        await fireEvent.click(minusButton)
        await fireEvent.click(minusButton)
    
        expect(queryTitle("severity-row").length).toEqual(3)
    })
    
    it('cannot decrement when there are 3 severity levels', () => {
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
    
    it('displays absolute min and absolute max', async () => {
        expect(absoluteMinDiv.textContent).toEqual(`${absoluteMin}`)
        expect(absoluteMaxDiv.textContent).toEqual(`${absoluteMax}`)
    })
    
    it('defaults userMin to 10 above absoluteMin and userMax 10 below absoluteMax', () => {
        expect(userMinInput.value).toEqual(`${absoluteMin + 10}`)
        expect(userMaxInput.value).toEqual(`${absoluteMax - 10}`)
    })

    it('defaults userMiddleMin and userMiddleMax between userMin and userMax', () => {
        expect(userMiddleInputMin.value).toEqual(`${defaultMiddleMin}`)
        expect(userMiddleInputMax.value).toEqual(`${defaultMiddleMax}`)
    })
    
    it('updates upper intermediate values when min input adjusted', async () => {
        const newMin = 400;
        await fireEvent.click(addButton)
        await fireEvent.change(userMinInput, { target: { value: newMin } })

        expect(queryTitle("severity-row")[1].textContent).toEqual(` ${newMin} - ${defaultMiddleMin}`)
    })
    
    it('updates lower intermediate values when max input adjusted', async () => {
        const newMax = 600;
        await fireEvent.click(addButton)
        await fireEvent.change(userMaxInput, { target: { value: newMax } })

        expect(queryTitle("severity-row")[3].textContent).toEqual(` ${defaultMiddleMax} - ${newMax}`)
    })

    it('updates upper intermediate values when middle min input adjusted', async () => {
        const newMiddleMin = defaultMiddleMin - 10;
        await fireEvent.click(addButton)
        await fireEvent.change(userMiddleInputMin, { target: { value: newMiddleMin } })

        expect(queryTitle("severity-row")[1].textContent).toEqual(` ${absoluteMin + 10} - ${newMiddleMin}`) 
    })

    it('updates lower intermediate values when middle max input adjusted', async () => {
        const newMiddleMax = defaultMiddleMax + 10;
        await fireEvent.click(addButton)
        await fireEvent.change(userMiddleInputMax, { target: { value: newMiddleMax } })

        expect(queryTitle("severity-row")[3].textContent).toEqual(` ${newMiddleMax} - ${absoluteMax - 10}`) 
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

        it('disables buttons when userMiddleMin is blank', async () => {
            const blank = "";
            await fireEvent.click(addButton)
            await fireEvent.change(userMiddleInputMin, { target: { value: blank } })
    
            expect(minusButton.disabled).toEqual(true)
            expect(addButton.disabled).toEqual(true)
            expect(updateOverlayButton.disabled).toEqual(true)
        })

        it('disables buttons when userMiddleMax is blank', async () => {
            const blank = "";
            await fireEvent.click(addButton)
            await fireEvent.change(userMiddleInputMax, { target: { value: blank } })
    
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

        it('disables buttons when userMiddleMin is greater than userMiddleMax', async () => {
            const newMiddleMin = defaultMiddleMax + 10
            await fireEvent.click(addButton)
            await fireEvent.change(userMiddleInputMin, { target: { value: newMiddleMin } })

            expect(minusButton.disabled).toEqual(true)
            expect(addButton.disabled).toEqual(true)
            expect(updateOverlayButton.disabled).toEqual(true)
            expect(userMiddleInputMin.validationMessage).toEqual("This value must be less than the chosen middle and max") 
        })

        it('disables buttons when userMiddleMin is less than userMin', async () => {
            const newMiddleMin = absoluteMin + 5
            await fireEvent.click(addButton)
            await fireEvent.change(userMiddleInputMin, { target: { value: newMiddleMin } })

            expect(minusButton.disabled).toEqual(true)
            expect(addButton.disabled).toEqual(true)
            expect(updateOverlayButton.disabled).toEqual(true)
            expect(userMiddleInputMin.validationMessage).toEqual("This value must be greater the absolute minimum and the chosen minimum") 
        })

        it('disables buttons when userMiddleMin is less than absoluteMin', async () => {
            const newMiddleMin = absoluteMin - 10
            await fireEvent.click(addButton)
            await fireEvent.change(userMiddleInputMin, { target: { value: newMiddleMin } })

            expect(minusButton.disabled).toEqual(true)
            expect(addButton.disabled).toEqual(true)
            expect(updateOverlayButton.disabled).toEqual(true)
            expect(userMiddleInputMin.validationMessage).toEqual("This value must be greater the absolute minimum and the chosen minimum")
        })

        it('disables buttons when userMiddleMin is greater than userMax', async () => {
            const newMiddleMin = absoluteMax - 10
            await fireEvent.click(addButton)
            await fireEvent.change(userMiddleInputMin, { target: { value: newMiddleMin } })

            expect(minusButton.disabled).toEqual(true)
            expect(addButton.disabled).toEqual(true)
            expect(updateOverlayButton.disabled).toEqual(true)
            expect(userMiddleInputMin.validationMessage).toEqual("This value must be less than the chosen middle and max")
        })

        it('disables buttons when userMiddleMax is less than userMiddleMin', async () => {
            const newMiddleMax = defaultMiddleMin - 10
            await fireEvent.click(addButton)
            await fireEvent.change(userMiddleInputMax, { target: { value: newMiddleMax } })

            expect(minusButton.disabled).toEqual(true)
            expect(addButton.disabled).toEqual(true)
            expect(updateOverlayButton.disabled).toEqual(true)
            expect(userMiddleInputMax.validationMessage).toEqual("This value must be greater the middle and min input values") 
        })

        it('disables buttons when userMiddleMax is less than userMin', async () => {
            const newMiddleMax = absoluteMin + 5
            await fireEvent.click(addButton)
            await fireEvent.change(userMiddleInputMax, { target: { value: newMiddleMax } })

            expect(minusButton.disabled).toEqual(true)
            expect(addButton.disabled).toEqual(true)
            expect(updateOverlayButton.disabled).toEqual(true)
            expect(userMiddleInputMax.validationMessage).toEqual("This value must be greater the middle and min input values") 
        })

        it('disables buttons when userMiddleMax is less than absoluteMin', async () => {
            const newMiddleMax = absoluteMin - 10
            await fireEvent.click(addButton)
            await fireEvent.change(userMiddleInputMax, { target: { value: newMiddleMax } })

            expect(minusButton.disabled).toEqual(true)
            expect(addButton.disabled).toEqual(true)
            expect(updateOverlayButton.disabled).toEqual(true)
            expect(userMiddleInputMax.validationMessage).toEqual("This value must be greater the middle and min input values")
        })

        it('disables buttons when userMiddleMax is greater than userMax', async () => {
            const newMiddleMax = absoluteMax - 10
            await fireEvent.click(addButton)
            await fireEvent.change(userMiddleInputMax, { target: { value: newMiddleMax } })

            expect(minusButton.disabled).toEqual(true)
            expect(addButton.disabled).toEqual(true)
            expect(updateOverlayButton.disabled).toEqual(true)
            expect(userMiddleInputMax.validationMessage).toEqual("This value must be less than the chosen and map max values")
        })

        it('disables buttons when userMiddleMax is greater than absoluteMax', async () => {
            const newMiddleMax = absoluteMax + 10
            await fireEvent.click(addButton)
            await fireEvent.change(userMiddleInputMax, { target: { value: newMiddleMax } })

            expect(minusButton.disabled).toEqual(true)
            expect(addButton.disabled).toEqual(true)
            expect(updateOverlayButton.disabled).toEqual(true)
            expect(userMiddleInputMax.validationMessage).toEqual("This value must be less than the chosen and map max values")
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
    const userMiddleMinValue = 450
    const userMiddleMaxValue = 500
    const severityLevels = 6;
    beforeEach(() => {
        mapMinMapMax.set({ min: absoluteMin, max: absoluteMax })
        threePointGradientState.set({
            absoluteMax,
            absoluteMin,
            userMin: userMinValue,
            userMax: userMaxValue,
            userMiddleMin: userMiddleMinValue,
            userMiddleMax: userMiddleMaxValue, 
            severityLevels: severityLevels
        })
    
        const { getByRole, queryAllByTitle, getByTitle, getByText } = render(ThreePointGradient)
        getRole = getByRole
        queryTitle = queryAllByTitle
        addButton = getRole("button", { name: "+" })
        minusButton = getRole("button", { name: "-" })
        userMinInput = getByTitle("userMin") as HTMLInputElement
        userMaxInput = getByTitle("userMax") as HTMLInputElement
        userMiddleInputMin = getByTitle("userMiddleMin") as HTMLInputElement
        userMiddleInputMax = getByTitle("userMiddleMax") as HTMLInputElement
        absoluteMaxDiv = getByTitle('absoluteMax')
        absoluteMinDiv = getByTitle('absoluteMin')
        updateOverlayButton = getByText('Update Overlay') as HTMLButtonElement
    })

    it('saves state', () => {
        expect(userMinInput.value).toEqual(userMinValue.toString())
        expect(userMaxInput.value).toEqual(userMaxValue.toString());
        expect(userMiddleInputMin.value).toEqual(userMiddleMinValue.toString())
        expect(userMiddleInputMax.value).toEqual(userMiddleMaxValue.toString())
        expect(queryTitle("severity-row").length).toEqual(severityLevels + 3) 
    })
})

describe('saving invalid state', () => {
    const userMinValue = absoluteMin - 30;
    const userMaxValue = absoluteMax + 30;
    const userMiddleMinValue = 450
    const userMiddleMaxValue = 500
    const severityLevels = 6;
    beforeEach(() => {
        mapMinMapMax.set({ min: absoluteMin, max: absoluteMax })
        threePointGradientState.set({
            absoluteMax,
            absoluteMin,
            userMin: userMinValue,
            userMax: userMaxValue,
            userMiddleMin: userMiddleMinValue,
            userMiddleMax: userMiddleMaxValue, 
            severityLevels: severityLevels
        })
    
        const { getByRole, queryAllByTitle, getByTitle, getByText } = render(ThreePointGradient)
        getRole = getByRole
        queryTitle = queryAllByTitle
        addButton = getRole("button", { name: "+" })
        minusButton = getRole("button", { name: "-" })
        userMinInput = getByTitle("userMin") as HTMLInputElement
        userMaxInput = getByTitle("userMax") as HTMLInputElement
        userMiddleInputMin = getByTitle("userMiddleMin") as HTMLInputElement
        userMiddleInputMax = getByTitle("userMiddleMax") as HTMLInputElement
        absoluteMaxDiv = getByTitle('absoluteMax')
        absoluteMinDiv = getByTitle('absoluteMin')
        updateOverlayButton = getByText('Update Overlay') as HTMLButtonElement
    })

    it('saves state and disables buttons', () => {
        expect(userMinInput.value).toEqual(userMinValue.toString());
        expect(userMaxInput.value).toEqual(userMaxValue.toString());
        expect(userMiddleInputMin.value).toEqual(userMiddleMinValue.toString())
        expect(userMiddleInputMax.value).toEqual(userMiddleMaxValue.toString())
        expect(queryTitle("severity-row").length).toEqual(severityLevels + 3) 
        expect(addButton.disabled).toEqual(true)
        expect(minusButton.disabled).toEqual(true)
        expect(updateOverlayButton.disabled).toEqual(true)
    })
})