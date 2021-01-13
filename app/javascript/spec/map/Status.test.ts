import { render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { selectedPanel, PANELS, insectPanelState, diseasePanelState, customPanelState } from '../../src/store/store';
import Status from '../../src/components/map/Status.svelte';

let getText;
beforeEach(() => {
    const { getByText } = render(Status);
    getText = getByText
})

describe('when insect panel selected', () => {
    it('shows feedback when no model is submitted', async () => {
        selectedPanel.set(PANELS.INSECT)
        await tick();

        expect(getText("No Model Submitted")).toBeInTheDocument()
    })

    it('shows current affliction name', async () => {
        selectedPanel.set(PANELS.INSECT)
        insectPanelState.set({currentAffliction: { name: "insect name"}})
        await tick();

        expect(getText("insect name")).toBeInTheDocument()
    })
})

describe('when disease panel selected', () => {
    it('shows feedback when no model is submitted', async () => {
        selectedPanel.set(PANELS.DISEASE)
        await tick()

        expect(getText("No Model Submitted")).toBeInTheDocument()

    })

    it('shows current affliction name', async () => {
        selectedPanel.set(PANELS.DISEASE)
        diseasePanelState.set({currentAffliction: { name: "disease name"}})
        await tick()

        expect(getText("disease name")).toBeInTheDocument()
    })
})

describe('when custom panel selected', () => {
    it('shows none when no tmin/max', async () => {
        selectedPanel.set(PANELS.CUSTOM);
        await tick();

        expect(getText("Custom model: None/None \u2103")).toBeInTheDocument()
    })

    it('shows tMin and TMax and temp scale', async () => {
        selectedPanel.set(PANELS.CUSTOM);
        customPanelState.set({t_max: 10, t_min: 5, in_fahrenheit: true})
        await tick();

        expect(getText("Custom model: 5/10 \u2109")).toBeInTheDocument()
    })
})
