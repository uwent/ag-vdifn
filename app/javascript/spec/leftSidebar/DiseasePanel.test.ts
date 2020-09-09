import DiseasePanel from '../../src/components/leftSidebar/DiseasePanel.svelte';
import { fireEvent, render } from '@testing-library/svelte'
import { panelKey, submitParams, startDate, endDate, afflictionValue } from '../../src/store/store'
import { get } from 'svelte/store'
let getText;
let diseasePanel; 

beforeEach(() => {
    const { getByText, component } = render(DiseasePanel, {
        props: {
            data: []
        }
    });
    getText = getByText;
    diseasePanel = component;
    startDate.set("2000-10-10");
    endDate.set("2000-11-10");
    afflictionValue.set(1)
})

it('should dispatch submit params when button is clicked', () => {
    const button = getText("Select")

    fireEvent.click(button);

    expect(get(submitParams)).toEqual({
        start_date: "2000-10-10",
        end_date: "2000-11-10",
        pest_id: 1
    })
})

it('sets context data for child elements', () => {
    expect(diseasePanel.$$.context.get(panelKey)).toEqual({
        getCrops: expect.any(Function),
        dateToolTip: {
            startDate: "Date of Emergence/Last Fungicide Application",
            endDate: "Date through which disease severity values are accumulated",
            startLabel: "Application"
        },
        getAfflictionName: expect.any(Function)
    })
})
