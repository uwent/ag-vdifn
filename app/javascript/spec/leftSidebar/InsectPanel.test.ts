import InsectPanel from '../../src/components/leftSidebar/InsectPanel.svelte';
import { fireEvent, render } from '@testing-library/svelte'
import { panelKey, afflictionParams, startDate, endDate, afflictionValue } from '../../src/store/store'
import { get } from 'svelte/store'
import moment from 'moment'
let getText;
let insectPanel; 

beforeEach(() => {
    const { getByText, component } = render(InsectPanel, {
        props: {
            data: []
        }
    });
    getText = getByText;
    insectPanel = component;
    startDate.set("2000-10-10");
    endDate.set("2000-11-10");
    afflictionValue.set(1)
})

it('should dispatch submit params when button is clicked', () => {
    const button = getText("Select")
    fireEvent.click(button);
    expect(get(afflictionParams)).toEqual({
        start_date: "2000-10-10",
        end_date: "2000-11-10",
        pest_id: 1
    })
})

it('sets context data for child elements', () => {
    expect(insectPanel.$$.context.get(panelKey)).toEqual({
        getCrops: expect.any(Function),
        dateToolTip: {
            startDate: "Biofix date for insect",
            endDate: "Date through which degree days are accumulated",
            startLabel: "Biofix"
        },
        getAfflictionName: expect.any(Function),
        defaultStartDate: moment.utc().subtract(1, 'week').format("YYYY-MM-DD")
    })
})
