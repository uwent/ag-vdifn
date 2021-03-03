import DatePicker from '../../src/components/leftSidebar/DatePicker.svelte'
import { fireEvent, render } from '@testing-library/svelte'
import { panelKey, selectedAffliction } from '../../src/store/store'
import SetContextTest from '../testComponents/SetContextTest.svelte'
import moment from 'moment'
import { tick } from 'svelte'

let startPicker
let endPicker
let startTooltip: HTMLElement
let endTooltip: HTMLElement

Date.now = jest.fn(() => +new Date('2020-06-01'))

const today = moment.utc().format('YYYY-MM-DD')
const lastWeek = moment.utc().subtract(1, 'week').format('YYYY-MM-DD')
const nextWeek = moment.utc().add(1, 'week').format('YYYY-MM-DD')
const twoWeeksAgo = moment.utc().subtract(2, 'week').format('YYYY-MM-DD')
const lastMonth = moment.utc().subtract(1, 'month').format('YYYY-MM-DD')
const lastYear = moment.utc().subtract(1, 'year').format('YYYY-MM-DD')
const endOfLastYear = moment.utc().subtract(1, 'year').format('YYYY-12-31')

it('sets a mock date', () => {
  expect(today).toEqual('2020-06-01')
})

describe('common behavior for all panels', () => {
  beforeEach(() => {
    const { getByTestId } = render(SetContextTest, {
      props: {
        Component: DatePicker,
        context_key: panelKey,
        context_value: {
          dateToolTip: {
            startDate: 'Start date',
            endDate: 'End date',
            startLabel: 'Application',
          },
          defaultStartDate: lastWeek,
        },
      },
    })
    startPicker = getByTestId('datepicker-start')
    endPicker = getByTestId('datepicker-end')
    startTooltip = getByTestId('start-date-tooltip')
    endTooltip = getByTestId('end-date-tooltip')
  })
  
  it('renders tooltips', () => {
    expect(startTooltip.getAttribute('aria-label')).toEqual('Start date')
    expect(endTooltip.getAttribute('aria-label')).toEqual('End date')
  })
  
  it('defaults max of start date and end date to today', () => {
    expect(startPicker.max).toEqual(today)
    expect(endPicker.max).toEqual(today)
  })

  it('enforces max date values', async () => {
    await fireEvent.change(startPicker, { target: { value: nextWeek } })
    expect(startPicker.validationMessage).toEqual('Constraints not satisfied')
    await fireEvent.change(startPicker, { target: { value: nextWeek } })
    expect(startPicker.validationMessage).toEqual('Constraints not satisfied')
  })
  
  it('defaults start date to whatever is set in the context', async () => {
    await tick()
    expect(startPicker.value).toEqual(lastWeek)
  })
  
  it('sets the start date to the biofix', async () => {
    selectedAffliction.set({
      id: 1,
      name: 'insect',
      biofix_date: twoWeeksAgo,
      end_date_enabled: true,
    })
    await tick()
    expect(startPicker.value).toEqual(twoWeeksAgo)
    expect(endPicker.value).toEqual(today)
  })

  it('moves start date back when end date passes it', async () => {
    await fireEvent.change(endPicker, { target: { value: twoWeeksAgo } })
    expect(endPicker.value).toEqual(twoWeeksAgo)
    expect(startPicker.value).toEqual(twoWeeksAgo)
  })

  // it('moves end date back when start date passes it', async () => {
  //   await fireEvent.change(endPicker, { target: { value: twoWeeksAgo } })
  //   expect(endPicker.value).toEqual(twoWeeksAgo)
  //   expect(startPicker.value).toEqual(twoWeeksAgo)
  //   await fireEvent.change(startPicker, { target: { value: lastWeek } })
  //   expect(startPicker.value).toEqual(lastWeek)
  //   expect(endPicker.value).toEqual(lastWeek)
  // })

  // it('moves end date to end of year when start date moves to different year', async () => {
  //   await fireEvent.change(startPicker, { target: { value: lastYear } })
  //   expect(startPicker.value).toEqual(lastYear)
  //   expect(endPicker.value).toEqual(endOfLastYear)
  // })

  // it('changes the start date tooltip for early blight', async () => {
  //   const expected = 'Start of year'
  //   selectedAffliction.set({
  //     id: 1,
  //     name: 'Early Blight',
  //     biofix_date: twoWeeksAgo,
  //     end_date_enabled: true,
  //   })
  //   await tick()
  //   expect(selectedAffliction.name).toEqual('Early Blight')
  //   expect(startTooltip.getAttribute('aria-label')).toEqual(expected)
  // })

  // it('disables end date if pest has end date disabled', async () => {
  //   selectedAffliction.set({ id: 1, name: 'insect', end_date_enabled: false })
  //   const endDate: HTMLInputElement = getLabelText('End Date')
  //   await tick()
  //   expect(endDate.disabled).toEqual(true)
  // })

})
