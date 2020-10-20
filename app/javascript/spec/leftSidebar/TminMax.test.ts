import TminMax from '../../src/components/leftSidebar/TminMax.svelte'
import { fireEvent, render } from '@testing-library/svelte'
import { panelKey } from '../../src/store/store';
import SetContextTest from '../testComponents/SetContextTest.svelte';
import { selectedAffliction } from '../../src/store/store';
import { tick } from 'svelte';
let getLabelText;
let getTitle;
let getRole;

beforeEach(() => {
    const data = [{
        id: 1,
        name: "corn",
        afflictions: [{id: 5, name: "bug", t_min: 30, t_max: 80}],
    },
    {
        id: 2,
        name: 'carrots',
        afflictions: [{id: 15, name: "ladybug", t_min: 50, t_max: 86}, {id: 6, name: "grasshopper", t_min: 48, t_max: null}]
    }]

    const { getByLabelText, getByTitle, getByRole } = render(SetContextTest, {
        props: {
            Component: TminMax,
            context_key: panelKey,
            context_value: {
                getCrops: () => data
            },
        }
    });
    getLabelText = getByLabelText;
    getTitle = getByTitle;
    getRole = getByRole;
});

it("defaults tMin and tMax to first crop's affliction respective tMin and tMax", () => {
    expect(getRole("textbox", { name: "Tmin"}).value).toEqual("30")
    expect(getRole("textbox", { name: "Tmax"}).value).toEqual("80")
})

it('updates tMin and tMax for selected affliction', async () => {
    selectedAffliction.set({id: 15, name: "ladybug", t_min: 50, t_max: 86})
    await tick();
    expect(getRole("textbox", { name: "Tmin"}).value).toEqual("50")
    expect(getRole("textbox", { name: "Tmax"}).value).toEqual("86")
})

it('defaults temp to fahrenheit', () => {
    expect(getTitle("temp-unit-toggle").checked).toEqual(true)
})

it('converts values between celcius and fahrenheit when temp unit is toggled', async () => {
    const tempToggle: HTMLInputElement = getTitle("temp-unit-toggle");
    await fireEvent.click(tempToggle)
    expect(tempToggle.checked).toEqual(false)
    expect(getRole("textbox", { name: "Tmin"}).value).toEqual("-1.1")
    expect(getRole("textbox", { name: "Tmax"}).value).toEqual("26.7")
    await fireEvent.click(tempToggle)
    expect(tempToggle.checked).toEqual(true)
    expect(getRole("textbox", { name: "Tmin"}).value).toEqual("30.0")
    expect(getRole("textbox", { name: "Tmax"}).value).toEqual("80.1")
})

