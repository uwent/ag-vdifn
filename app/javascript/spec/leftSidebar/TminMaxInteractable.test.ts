import TminMaxInteractable from '../../src/components/leftSidebar/TminMaxInteractable.svelte'
import { fireEvent, render } from '@testing-library/svelte'
import { tMinTmax } from '../../src/store/store'
let getLabelText;
let getTitle;
let getRole;
let _component;
let spy;
const firstCropTmin = 30;
const firstCropTmax = 80
describe('TminMaxInteractable component', () => {
    beforeEach(() => {
        spy = jest.spyOn(tMinTmax, 'set')

        const data = [{
            id: 1,
            name: "corn",
            afflictions: [{id: 5, name: "bug", t_min: firstCropTmin, t_max: firstCropTmax}],
        },
        {
            id: 2,
            name: 'carrots',
            afflictions: [{id: 15, name: "ladybug", t_min: 50, t_max: 86}, {id: 6, name: "grasshopper", t_min: 48, t_max: null}]
        }]
    
        const { getByLabelText, getByTitle, getByRole, component } = render(TminMaxInteractable);
        getLabelText = getByLabelText;
        getTitle = getByTitle;
        getRole = getByRole;
        _component = component;
    });
        
       afterEach(jest.clearAllMocks)

    it('sets tMin and tMax to default values', () => {
        const checkbox = getRole("checkbox", { name: "No TMax"})
        expect(getRole("spinbutton", { name: "Tmin"}).value).toEqual("50")
        expect(getRole("spinbutton", { name: "Tmax"}).disabled).toEqual(true)
        expect(checkbox.checked).toEqual(true)
       })

    it('defaults temp to fahrenheit', () => {
        expect(getTitle("temp-unit-toggle").checked).toEqual(true)
    })

    it('converts values between celcius and fahrenheit when temp unit is toggled', async () => {
        const checkbox = getRole("checkbox", { name: "No TMax"});
        const tMax = getRole("spinbutton", { name: "Tmax"});
        const tMin = getRole("spinbutton", { name: "Tmin"})
        const tempToggle: HTMLInputElement = getTitle("temp-unit-toggle");
        await fireEvent.click(checkbox)

        await fireEvent.change(tMax, { target: { value: 80 }})

        await fireEvent.click(tempToggle)
        expect(tempToggle.checked).toEqual(false)
        expect(tMin.value).toEqual("10.0")
        expect(tMax.value).toEqual("26.7")

        await fireEvent.click(tempToggle)
        expect(tempToggle.checked).toEqual(true)
        expect(tMin.value).toEqual("50.0")
        expect(tMax.value).toEqual("80.1")
    })

    it('unchecking "no Tmax" button enables tMax input', async () => {
        const tMaxInput: HTMLInputElement = getRole("spinbutton", { name: "Tmax"})
        await fireEvent.click(getRole("checkbox", { name: "No TMax"}))

        expect(tMaxInput.disabled).toEqual(false)
    })

    describe("validations", () => {
        beforeEach(async () => {
            const checkbox = getRole("checkbox", { name: "No TMax"})
               await fireEvent.click(checkbox)
        })
        it('shows validation when tMax is less than tMin', async () => {
            const tMinInput: HTMLInputElement = getRole("spinbutton", { name: "Tmin"})

            await fireEvent.change(tMinInput, { target: { value: 100}})

            expect(tMinInput.validationMessage).toEqual("This value must be less than the tMax")
        })

        it('shows validation when tMin is greater than tMin', async () => {
            const tMaxInput: HTMLInputElement = getRole("spinbutton", { name: "Tmax"})

            await fireEvent.change(tMaxInput, { target: { value: 0}})

            expect(tMaxInput.validationMessage).toEqual("This value must be greater than the tMin") 
        })

        it("does not validate if tMax is disabled", async () => {
            const tMinInput: HTMLInputElement = getRole("spinbutton", { name: "Tmin"})

            await fireEvent.click(getRole("checkbox", { name: "No TMax"})) 

            await fireEvent.change(tMinInput, { target: { value: 100}})

            expect(tMinInput.validationMessage).toEqual("")
        })
    })
    it('sets store when updated', async () => {
        expect(spy).toHaveBeenCalled()
    })
})
