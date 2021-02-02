import InsectPanel from '../../src/components/leftSidebar/InsectPanel.svelte'
import { fireEvent, render } from '@testing-library/svelte'
import {
  selectedAffliction,
  selectedPanel,
  PANELS,
  insectPanelState,
  panelKey,
  insectPanelParams,
  startDate,
  endDate,
  afflictionValue,
} from '../../src/store/store'
import { get } from 'svelte/store'
import moment from 'moment'

let getText
let insectPanel

beforeEach(() => {
  const { getByText, component } = render(InsectPanel, {
    props: {
      data: [],
    },
  })
  getText = getByText
  insectPanel = component
  startDate.set('2000-10-10')
  endDate.set('2000-11-10')
  afflictionValue.set(1)
  selectedAffliction.set({ name: 'bug', t_min: 42, t_max: null })
})

it('should set selected panel to insect on mount', () => {
  expect(get(selectedPanel)).toEqual(PANELS.INSECT)
})

it('should update insect panels state when submit button clicked', async () => {
  const button = getText('Select')
  await fireEvent.click(button)

  expect(get(insectPanelState)).toEqual({
    currentAffliction: { name: 'bug', t_min: 42, t_max: null },
  })
})

it('should dispatch submit params when button is clicked', async () => {
  const button = getText('Select')
  await fireEvent.click(button)
  expect(get(insectPanelParams)).toEqual({
    start_date: '2000-10-10',
    end_date: '2000-11-10',
    pest_id: 1,
    t_min: 42,
    t_max: null,
    in_fahrenheit: true,
  })
})

it('sets context data for child elements', () => {
  expect(insectPanel.$$.context.get(panelKey)).toEqual({
    panelType: 'Insect',
    getCrops: expect.any(Function),
    dateToolTip: {
      startDate: 'Biofix date for insect',
      endDate: 'Date through which degree days are accumulated',
      startLabel: 'Biofix',
    },
    getAfflictionName: expect.any(Function),
    defaultStartDate: moment.utc().startOf('year').format('YYYY-MM-DD'),
  })
})
