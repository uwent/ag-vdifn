<style lang="scss">
  label {
    padding: 0;
  }

  .select-wrapper {
    display: flex;
  }

  .label-text {
    color: #484848;
    font-size: 0.75em;
  }

  .datepicker-tooltip {
    margin-left: 8px;
    margin: auto;
    font-size: 0.75em;
    width: 50%;
  }

  .clear {
    clear: both;
    height: 0.5em;
  }

  .preset-buttons {
    font-size: 0.75em;
    overflow: hidden;
    display: flex;
    justify-content: space-evenly;
  }

  .preset-buttons button {
    padding: 5px 8px;
    margin: 5px;
    background: rgb(225, 225, 225);
    border: 1px solid #d0d0d0;
    border-radius: 3px;
    appearance: none;
    cursor: pointer;
    font-size: 1em;

    &:hover {
      background: rgb(200, 200, 200);
    }
  }
</style>

<script lang="ts">
  import {
    format,
    parseISO,
    subDays,
    subWeeks,
    subMonths,
    isAfter,
    isBefore,
    getYear,
    startOfYear,
  } from 'date-fns';
  import { getContext, onDestroy } from 'svelte';
  import { endDate, panelKey, startDate, selectedPest } from '@store';

  const { panelType, dateToolTip, defaultStartDate } = getContext<any>(panelKey);

  const formatDate = (date: Date): string => format(date, 'yyyy-MM-dd');
  const tryParseDate = (dateStr: string): Date | null => (dateStr ? parseISO(dateStr) : null);

  let {
    today = formatDate(subDays(new Date(), 1)),
    endDateValue = today || '',
    defaultEndDateValue = today || '',
    startDateValue = defaultStartDate || '',
    defaultStartDateValue = defaultStartDate || '',
    startLabel = 'Start date',
  } = $props<{
    today?: string;
    endDateValue?: string;
    defaultEndDateValue?: string;
    startDateValue?: string;
    defaultStartDateValue?: string;
    startLabel?: string;
  }>();

  // Update store values when local state changes
  $effect(() => {
    if (tryParseDate(startDateValue)) $startDate = startDateValue;
  });

  $effect(() => {
    if (tryParseDate(endDateValue)) $endDate = endDateValue;
  });

  // Handle end date changes
  function updateStartDateInput() {
    const start = tryParseDate(startDateValue);
    const end = tryParseDate(endDateValue);
    if (!start || !end) return (endDateValue = $endDate);

    // If end date is before start date, set start date to end date
    if (isBefore(end, start)) {
      startDateValue = endDateValue;
    }

    // If end date is in a different year, set start date to Jan 1 of that year
    if (getYear(end) !== getYear(start)) {
      startDateValue = `${getYear(end)}-01-01`;
    }
  }

  // Handle start date changes
  function updateEndDateInput() {
    const start = tryParseDate(startDateValue);
    const end = tryParseDate(endDateValue);
    if (!start || !end) return (startDateValue = $startDate);

    // If start date is after end date, set end date to start date
    if (isAfter(start, end)) {
      endDateValue = startDateValue;
    }

    // If start date is in a different year, adjust end date accordingly
    if (getYear(start) !== getYear(end)) {
      const yearEnd = `${getYear(start)}-12-31`;

      if (isBefore(parseISO(today), parseISO(yearEnd))) {
        endDateValue = today;
      } else {
        endDateValue = yearEnd;
      }
    }
  }

  // Quick date selection functions
  function selectPastWeek() {
    endDateValue = today;
    startDateValue = formatDate(subWeeks(today, 1));
  }

  function selectPastMonth() {
    endDateValue = today;
    startDateValue = formatDate(subMonths(today, 1));
  }

  function selectThisYear() {
    endDateValue = today;
    startDateValue = formatDate(startOfYear(new Date()));
  }

  function selectDefaults() {
    endDateValue = defaultEndDateValue;
    startDateValue = defaultStartDateValue;
  }

  function dateFeedback(dateStr: string): string {
    let date = tryParseDate(dateStr);
    if (!date) return `<< Date required`;
    if (getYear(date) !== getYear(new Date())) return '<< Not current year';
    return '';
  }

  // Panel and pest-specific configurations
  const unsubscribe = selectedPest.subscribe((pest) => {
    if (!pest) return;
    if (panelType != 'custom') {
      startLabel = pest.biofix_label || 'Start date';

      // Handle biofix date logic
      if (pest.biofix_date) {
        if (pest.biofix_date < today) {
          defaultStartDateValue = pest.biofix_date;
          defaultEndDateValue = today;
        } else {
          // If biofix hasn't occurred yet, use last year's date
          const lastYearBiofix = format(subDays(parseISO(pest.biofix_date), 365), 'yyyy-MM-dd');
          defaultStartDateValue = lastYearBiofix;
          defaultEndDateValue = `${getYear(parseISO(lastYearBiofix))}-12-31`;
        }
        startDateValue = defaultStartDateValue;
        endDateValue = defaultEndDateValue;
      }
    }
  });

  onDestroy(unsubscribe);
</script>

<fieldset id="datepicker">
  <legend>Date Range</legend>
  <label for="datepicker-start">{startLabel}</label>
  <div class="select-wrapper" id="datepicker-start-wrapper">
    <input
      type="date"
      class="datepicker"
      title={dateToolTip.startDate}
      id="datepicker-start"
      data-testid="datepicker-start"
      bind:value={startDateValue}
      onfocus={updateEndDateInput}
      onfocusout={updateEndDateInput}
      max={today}
      aria-label={startLabel}
    />
    <div class="datepicker-tooltip" aria-live="polite">
      {dateFeedback(startDateValue)}
    </div>
  </div>
  <label for="datepicker-end">End Date</label>
  <div class="select-wrapper" id="datepicker-end-wrapper">
    <input
      type="date"
      class="datepicker"
      title={dateToolTip.endDate}
      id="datepicker-end"
      data-testid="datepicker-end"
      bind:value={endDateValue}
      onfocus={updateStartDateInput}
      onfocusout={updateStartDateInput}
      max={today}
      aria-label="End Date"
    />
    <div class="datepicker-tooltip" aria-live="polite">{dateFeedback(endDateValue)}</div>
  </div>
  <div class="clear"></div>
  <div class="label-text">Quick date ranges:</div>
  <div class="preset-buttons" role="group" aria-label="Quick date range options">
    <button
      title="Set date range to past week"
      data-testid="button-past-week"
      onclick={selectPastWeek}
      aria-label="Past week"
    >
      Past week
    </button>
    <button
      title="Set date range to past month"
      data-testid="button-past-month"
      onclick={selectPastMonth}
      aria-label="Past month"
    >
      Past month
    </button>
    <button
      title="Set date range to Jan 1 -> today"
      data-testid="button-this-year"
      onclick={selectThisYear}
      aria-label="This year"
    >
      This year
    </button>
    <button
      title="Restore default date settings for this model"
      data-testid="button-defaults"
      onclick={selectDefaults}
      aria-label="Defaults"
    >
      Defaults
    </button>
  </div>
</fieldset>
