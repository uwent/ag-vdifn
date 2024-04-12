import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import moment from 'moment';

import SetContextTest from '../testComponents/SetContextTest.svelte';
import DatePicker from '@components/leftSidebar/DatePicker.svelte';
import { panelKey, selectedAffliction } from '@store';
import type { Pest } from '@types';

let startPicker;
let endPicker;
let buttonPastWeek;
let buttonPastMonth;
let buttonThisYear;
let buttonDefaults;

Date.now = vi.fn(() => +new Date('2020-06-01'));

const today = moment.utc().format('YYYY-MM-DD');
const yesterday = moment.utc().subtract(1, 'day').format('YYYY-MM-DD');
const lastWeek = moment.utc().subtract(1, 'week').format('YYYY-MM-DD');
const nextWeek = moment.utc().add(1, 'week').format('YYYY-MM-DD');
const twoWeeksAgo = moment.utc().subtract(2, 'week').format('YYYY-MM-DD');
const lastMonth = moment.utc().subtract(1, 'month').format('YYYY-MM-DD');
const startOfYear = moment.utc().format('YYYY') + '-01-01';
// const endOfLastYear = moment.utc().subtract(1, 'year').format('YYYY-12-31')

test('sets a mock date', () => {
  expect(today).toEqual('2020-06-01');
});

describe('common behavior for all panels', () => {
  beforeEach(() => {
    render(SetContextTest, {
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
    });
    startPicker = screen.getByTestId('datepicker-start');
    endPicker = screen.getByTestId('datepicker-end');
  });

  test('renders tooltips', () => {
    expect(startPicker.getAttribute('title')).toEqual('Start date');
    expect(endPicker.getAttribute('title')).toEqual('End date');
  });

  test('defaults max of start date and end date to yesterday', () => {
    expect(startPicker.max).toEqual(yesterday);
    expect(endPicker.max).toEqual(yesterday);
  });

  test('enforces max date values', async () => {
    await fireEvent.change(startPicker, { target: { value: nextWeek } });
    expect(startPicker.validationMessage).toEqual('Constraints not satisfied');
    await fireEvent.change(startPicker, { target: { value: nextWeek } });
    expect(startPicker.validationMessage).toEqual('Constraints not satisfied');
  });

  test('defaults start date to whatever is set in the context', async () => {
    await tick();
    expect(startPicker.value).toEqual(lastWeek);
  });

  test('sets the start date to the biofix', async () => {
    const pest = {
      id: 1,
      name: 'insect',
      biofix_date: twoWeeksAgo,
      end_date_enabled: true,
    } as Pest;
    selectedAffliction.set(pest);
    await tick();
    expect(startPicker.value).toEqual(twoWeeksAgo);
    expect(endPicker.value).toEqual(yesterday);
  });

  test('moves start date back when end date passes it', async () => {
    await fireEvent.change(endPicker, { target: { value: twoWeeksAgo } });
    expect(endPicker.value).toEqual(twoWeeksAgo);
    expect(startPicker.value).toEqual(twoWeeksAgo);
  });
});

describe('Quick date range buttons', () => {
  beforeEach(() => {
    render(SetContextTest, {
      props: {
        Component: DatePicker,
        context_key: panelKey,
        context_value: {
          dateToolTip: {
            startDate: 'Start date',
            endDate: 'End date',
          },
          defaultStartDate: twoWeeksAgo,
        },
      },
    });
    startPicker = screen.getByTestId('datepicker-start');
    endPicker = screen.getByTestId('datepicker-end');
    buttonPastWeek = screen.getByTestId('button-past-week');
    buttonPastMonth = screen.getByTestId('button-past-month');
    buttonThisYear = screen.getByTestId('button-this-year');
    buttonDefaults = screen.getByTestId('button-defaults');
  });

  test('defaults to two weeks ago', () => {
    expect(startPicker.value).toEqual(twoWeeksAgo);
  });

  test('sets date range to one week on click', async () => {
    await fireEvent.click(buttonPastWeek);
    expect(startPicker.value).toEqual(lastWeek);
    expect(endPicker.value).toEqual(yesterday);
  });

  test('sets date range to one month on click', async () => {
    await fireEvent.click(buttonPastMonth);
    expect(startPicker.value).toEqual(lastMonth);
    expect(endPicker.value).toEqual(yesterday);
  });

  test('sets date range to current year on click', async () => {
    await fireEvent.click(buttonThisYear);
    expect(startPicker.value).toEqual(startOfYear);
    expect(endPicker.value).toEqual(yesterday);
  });

  test('restores default dates on click', async () => {
    await fireEvent.click(buttonThisYear);
    expect(startPicker.value).toEqual(startOfYear);
    expect(endPicker.value).toEqual(yesterday);
    await fireEvent.click(buttonDefaults);
    expect(startPicker.value).toEqual(twoWeeksAgo);
    expect(endPicker.value).toEqual(yesterday);
  });
});
