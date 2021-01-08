import TminMaxDisplay from '../../src/components/leftSidebar/TminMaxDisplay.svelte'
import SetContextTest from '../testComponents/SetContextTest.svelte';
import { panelKey } from '../../src/store/store';
import { fireEvent, render } from '@testing-library/svelte'
import { selectedAffliction } from '../../src/store/store';
import { tick } from 'svelte';
let getLabelText;
let getTitle;
let getRole;
const firstCropTmin = 30;
const firstCropTmax = 80
describe('TminMaxDisplay component', () => {
    beforeEach(() => {
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

        const { getByLabelText, getByTitle, getByRole } = render(SetContextTest, {
            props: {
                Component: TminMaxDisplay,
                context_key: panelKey,
                context_value: {
                    getCrops: () => data,
                    tMinMaxDisabled: () => true,
                },
            }
        });
        getLabelText = getByLabelText;
        getTitle = getByTitle;
        getRole = getByRole;
    });

    it('sets tMin to the first crop affliction', () => {
        expect(getTitle("Min temp")).toHaveTextContent(`${firstCropTmin}`)
    })

    it('sets tMax to the first crop affliction', () => {
        expect(getTitle("Max temp")).toHaveTextContent(`${firstCropTmax}`)
    })

    it('updates tMin and tMax for selected affliction', async () => {
        const t_min = 50;
        const t_max = 86
        selectedAffliction.set({id: 15, name: "ladybug", t_min: t_min, t_max: t_max})
        await tick();
        expect(getTitle("Min temp")).toHaveTextContent(`${t_min}`)
        expect(getTitle("Max temp")).toHaveTextContent(`${t_max}`)
    })

    it('defaults temp to fahrenheit', () => {
        expect(getTitle("temp-unit-toggle").checked).toEqual(true)
    })

    it('converts values between celcius and fahrenheit when temp unit is toggled', async () => {
        const tempToggle: HTMLInputElement = getTitle("temp-unit-toggle");
        await fireEvent.click(tempToggle)
        expect(tempToggle.checked).toEqual(false)
        expect(getTitle("Min temp")).toHaveTextContent("-1.1")
        expect(getTitle("Max temp")).toHaveTextContent("26.7")
        await fireEvent.click(tempToggle)
        expect(tempToggle.checked).toEqual(true)
        expect(getTitle("Min temp")).toHaveTextContent("30.0")
        expect(getTitle("Max temp")).toHaveTextContent("80.1")
    })
})
