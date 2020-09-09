import ModelSelection from '../../src/components/leftSidebar/ModelSelection.svelte';
import { panelKey } from '../../src/store/store';
import { fireEvent, render } from '@testing-library/svelte'
import SetContextTest from '../testComponents/SetContextTest.svelte';

let data;
let getRole;
let getQuery;

describe("when data present", () => {
    beforeEach(() => {
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
    
        const {  getByRole, queryByRole } = render(SetContextTest, {
            props: {
                Component: ModelSelection,
                context_key: panelKey,
                context_value: {
                    getCrops: () => data,
                    getAfflictionName: () => "Disease"
                },
            }
        });
        getRole = getByRole;
        getQuery = queryByRole;
    })

    it('defaults crop and affliction values to first in their respective lists', () => {
    
        expect(getRole('combobox', { name: 'Crop'})).toHaveValue('1')
        expect(getRole('combobox', {name: 'Disease'})).toHaveValue('5')
    })
    
    it('updates afflictions for selected crop', async () => {
        const select: HTMLElement = getRole('combobox', { name: 'Crop'});
        await fireEvent.change(select, { target: { value: '2' } } )
        expect(getRole('combobox', { name: 'Disease'})).toHaveValue('15')
    })
    
    it('shows modal when button is clicked', async () => {
        const button: HTMLElement = getRole('button')
        await fireEvent.click(button);
        expect(getRole('dialog', { name: 'Additional Information'})).toBeInTheDocument();
    })
    
    it('closes the modal when close button is clicked', async () => {
        const button: HTMLElement = getRole('button')
        await fireEvent.click(button);
        await fireEvent.click(getRole('button', { name: 'Close'}))
        expect(getQuery('dialog', { name: 'Additional Information'})).not.toBeInTheDocument();
    })
})

describe("when data not present", () => {
    beforeEach(() => {
        data = []
    
        const {  getByRole, queryByRole } = render(SetContextTest, {
            props: {
                Component: ModelSelection,
                context_key: panelKey,
                context_value: {
                    getCrops: () => data,
                    getAfflictionName: () => "Disease"
                },
            }
        });
        getRole = getByRole;
        getQuery = queryByRole;
    })
    
    it('renders empty select box', () => {
    
        expect(getRole('combobox', { name: 'Crop' })).toBeInTheDocument();
        expect(getRole('combobox', { name: 'Disease' })).toBeInTheDocument();
    })

    it('does not contain modal button', () => {
        expect(getQuery('button')).not.toBeInTheDocument();
    })
    
})
