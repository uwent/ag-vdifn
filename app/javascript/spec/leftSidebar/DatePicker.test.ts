import DatePicker from '../../src/components/leftSidebar/DatePicker.svelte'
import { fireEvent, render } from '@testing-library/svelte'
import { panelKey, selectedAffliction } from '../../src/store/store'
import SetContextTest from '../testComponents/SetContextTest.svelte'
import moment from 'moment'
import { tick } from 'svelte'

let getLabelText
let getTitle

const today = moment.utc().format('YYYY-MM-DD')
const lastWeek = moment.utc().subtract(1, 'week').format('YYYY-MM-DD')
const nextWeek = moment.utc().add(1, 'week').format('YYYY-MM-DD')
const twoWeeksAgo = moment.utc().subtract(2, 'week').format('YYYY-MM-DD')
const lastMonth = moment.utc().subtract(1, 'month').format('YYYY-MM-DD')
const twoMonthsAgo = moment.utc().subtract(2, 'month').format('YYYY-MM-DD')

beforeEach(() => {
  const { getByLabelText, getByTitle } = render(SetContextTest, {
    props: {
      Component: DatePicker,
      context_key: panelKey,
      context_value: {
        dateToolTip: {
          startDate: 'Start date',
          endDate: 'End date',
          startLabel: 'Application',
        },
        defaultStartDate: lastMonth,
      },
    },
  })
  getLabelText = getByLabelText
  getTitle = getByTitle
})

it('defaults max of start date and end date to today', () => {
  expect(getLabelText('End Date').max).toEqual(today)
  expect(getLabelText('Application').max).toEqual(today)
})

it('defaults start date to whatever is set in the context', async () => {
  await tick()
  expect(getLabelText('Application').value).toEqual(lastMonth)
})

it('start date cannot be greater than end date', async () => {
  const startDate: HTMLInputElement = getLabelText('Application')
  await fireEvent.change(startDate, { target: { value: nextWeek } })
  expect(startDate.validationMessage).toEqual('Constraints not satisfied')
})

it('tooltips are rendered', () => {
  const startDateToolTip: HTMLElement = getTitle('start-date-tooltip')
  const endDateToolTip: HTMLElement = getTitle('end-date-tooltip')
  expect(startDateToolTip.getAttribute('aria-label')).toEqual('Start date')
  expect(endDateToolTip.getAttribute('aria-label')).toEqual('End date')
})

// it('disables end date if pest has end date disabled', async () => {
//   selectedAffliction.set({ id: 1, name: 'insect', end_date_enabled: false })
//   const endDate: HTMLInputElement = getLabelText('End Date')
//   await tick()
//   expect(endDate.disabled).toEqual(true)
// })

it('sets the start date to the biofix', async () => {
  selectedAffliction.set({
    id: 1,
    name: 'insect',
    biofix_date: twoWeeksAgo,
    end_date_enabled: true,
  })
  const startDate: HTMLInputElement = getLabelText('Application')
  await tick()
  expect(startDate.value).toEqual(twoWeeksAgo)
})
