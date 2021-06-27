import DiseasePanel from '../../src/components/leftSidebar/DiseasePanel.svelte'
import { fireEvent, render } from '@testing-library/svelte'
import {
  selectedAffliction,
  diseasePanelState,
  PANELS,
  selectedPanel,
  panelKey,
  diseasePanelParams,
  startDate,
  endDate,
  afflictionValue,
} from '../../src/store/store'
import { get } from 'svelte/store'
import moment from 'moment'

let getText
let diseasePanel

beforeEach(() => {
  const { getByText, component } = render(DiseasePanel, {
    props: {
      data: [],
    },
  })
  getText = getByText
  diseasePanel = component
  startDate.set('2000-10-10')
  endDate.set('2000-11-10')
  afflictionValue.set(1)
  selectedAffliction.set({ name: 'bug' })
})

it('sets selectedPanel state to disease panel on mount', () => {
  expect(get(selectedPanel)).toEqual(PANELS.DISEASE)
})

it('should dispatch submit params when button is clicked', () => {
  const button = getText('Submit')
  fireEvent.click(button)
  expect(get(diseasePanelParams)).toEqual({
    start_date: '2000-10-10',
    end_date: '2000-11-10',
    in_fahrenheit: true,
    pest_id: 1,
  })
})

it('should update disease panel state', async () => {
  const button = getText('Submit')
  fireEvent.click(button)
  expect(get(diseasePanelState)).toEqual({
    currentAffliction: { name: 'bug' },
    loaded: true,
  })
})

it('sets context data for child elements', () => {
  expect(diseasePanel.$$.context.get(panelKey)).toEqual({
    panelType: 'Disease',
    getCrops: expect.any(Function),
    dateToolTip: {
      startDate: 'Date of Emergence/Last Fungicide Application',
      endDate: 'Date through which disease severity values are accumulated',
      startLabel: 'Date of Emergence/Last Fungicide Application',
    },
    defaultStartDate: moment.utc().subtract(1, 'week').format('YYYY-MM-DD'),
    getAfflictionName: expect.any(Function),
  })
})
