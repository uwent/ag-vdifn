import SeverityGradient from '../../src/components/leftSidebar/SeverityGradient.svelte';
import { panelKey, mapMinMapMax, twoPointGradientState, threePointGradientState, customParams } from '../../src/store/store';
import { render } from '@testing-library/svelte'
import SetContextTest from '../testComponents/SetContextTest.svelte';
import { tick } from 'svelte';

let data;
let getRole;
let getTitle;

describe("when data present", () => {
    beforeEach(() => {
        mapMinMapMax.set({
            max: 10,
            min: 5
        })
        twoPointGradientState.set({})
        threePointGradientState.set({})
        data = [{
            id: 1, 
            name: "corn", 
            afflictions: [{id: 5, name: "bug"}],
        },
        {
            id: 2,
            name: 'carrots',
            afflictions: [{id: 15, name: "ladybug"}, {id: 6, name: "grasshopper"}, {id: 10, name: "fly"}]
        }
        ]
    
        const {  getByRole, getByTitle } = render(SetContextTest, {
            props: {
                Component: SeverityGradient,
                context_key: panelKey,
                context_value: {},
            }
        });
        getRole = getByRole;
        getTitle = getByTitle;

    })

    it('defaults to 2 point gradient', async () => {
        await tick();
        expect(getTitle('gradient-2-point').checked).toEqual(true)
        expect(getTitle('gradient-3-point').checked).toEqual(false)
    })

    it('displays params once submitted', async () => {
        customParams.set({
            start_date: "2020-10-10",
            end_date: "2020-10-20",
            t_min: 50,
            t_max: null,
            in_fahrenheit: true
        })
        await tick();
        expect(getTitle('submitted-params').textContent).toContain(`Start Date: 10/10/2020 End Date: 10/20/2020 T Min: 50 T Max: None Temp scale: Fahrenheit`)
    })
})