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

  $effect(() => {
    if (tryParseDate(startDateValue)) $startDate = startDateValue;
  });

  $effect(() => {
    if (tryParseDate(endDateValue)) $endDate = endDateValue;
  });

  function updateStartDateInput() {
    const start = tryParseDate(startDateValue);
    const end = tryParseDate(endDateValue);
    if (!start || !end) return (endDateValue = $endDate);
    if (isBefore(end, start)) startDateValue = endDateValue;
    if (getYear(end) !== getYear(start)) startDateValue = `${getYear(end)}-01-01`;
  }

  function updateEndDateInput() {
    const start = tryParseDate(startDateValue);
    const end = tryParseDate(endDateValue);
    if (!start || !end) return (startDateValue = $startDate);
    if (isAfter(start, end)) endDateValue = startDateValue;
    if (getYear(start) !== getYear(end)) {
      const yearEnd = `${getYear(start)}-12-31`;
      endDateValue = isBefore(parseISO(today), parseISO(yearEnd)) ? today : yearEnd;
    }
  }

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

  const unsubscribe = selectedPest.subscribe((pest) => {
    if (!pest) return;
    if (panelType != 'custom') {
      startLabel = pest.biofix_label || 'Start date';
      if (pest.biofix_date) {
        if (pest.biofix_date < today) {
          defaultStartDateValue = pest.biofix_date;
          defaultEndDateValue = today;
        } else {
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

<fieldset id="datepicker" class="border border-gray-300 p-4 rounded-md">
  <legend class="text-base font-semibold">Date Range</legend>

  <label for="datepicker-start" class="block mb-1">{startLabel}</label>
  <div class="flex items-center gap-2 mb-3">
    <input
      type="date"
      class="datepicker border border-gray-300 px-2 py-1 rounded text-sm"
      title={dateToolTip.startDate}
      id="datepicker-start"
      data-testid="datepicker-start"
      bind:value={startDateValue}
      on:focus={updateEndDateInput}
      on:focusout={updateEndDateInput}
      max={today}
      aria-label={startLabel}
    />
    <div class="text-xs w-1/2 text-gray-600 italic" aria-live="polite">
      {dateFeedback(startDateValue)}
    </div>
  </div>

  <label for="datepicker-end" class="block mb-1">End Date</label>
  <div class="flex items-center gap-2 mb-3">
    <input
      type="date"
      class="datepicker border border-gray-300 px-2 py-1 rounded text-sm"
      title={dateToolTip.endDate}
      id="datepicker-end"
      data-testid="datepicker-end"
      bind:value={endDateValue}
      on:focus={updateStartDateInput}
      on:focusout={updateStartDateInput}
      max={today}
      aria-label="End Date"
    />
    <div class="text-xs w-1/2 text-gray-600 italic" aria-live="polite">
      {dateFeedback(endDateValue)}
    </div>
  </div>

  <div class="h-2"></div>

  <div class="text-xs text-gray-700 font-medium mb-1">Quick date ranges:</div>
  <div class="flex justify-evenly flex-wrap gap-2 text-sm" role="group" aria-label="Quick date range options">
    <button
      class="px-3 py-1 border border-gray-300 rounded bg-gray-200 hover:bg-gray-300 transition"
      title="Set date range to past week"
      data-testid="button-past-week"
      on:click={selectPastWeek}
      aria-label="Past week"
    >
      Past week
    </button>
    <button
      class="px-3 py-1 border border-gray-300 rounded bg-gray-200 hover:bg-gray-300 transition"
      title="Set date range to past month"
      data-testid="button-past-month"
      on:click={selectPastMonth}
      aria-label="Past month"
    >
      Past month
    </button>
    <button
      class="px-3 py-1 border border-gray-300 rounded bg-gray-200 hover:bg-gray-300 transition"
      title="Set date range to Jan 1 -> today"
      data-testid="button-this-year"
      on:click={selectThisYear}
      aria-label="This year"
    >
      This year
    </button>
    <button
      class="px-3 py-1 border border-gray-300 rounded bg-gray-200 hover:bg-gray-300 transition"
      title="Restore default date settings for this model"
      data-testid="button-defaults"
      on:click={selectDefaults}
      aria-label="Defaults"
    >
      Defaults
    </button>
  </div>
</fieldset>
