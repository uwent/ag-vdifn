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

  import { getContext } from 'svelte';
  import { endDate, panelKey, startDate } from '@store';

  const { panelType, dateToolTip = {}, defaultStartDate } = getContext<any>(panelKey);

  const formatDate = (date: Date): string => format(date, 'yyyy-MM-dd');
  const tryParseDate = (dateStr: string): Date | null => (dateStr ? parseISO(dateStr) : null);

  let todayDate = subDays(new Date(), 1);
  let today = formatDate(todayDate);

  let startLabel = 'Start date';
  let startDateValue = $state(defaultStartDate || today);
  let endDateValue = $state(today);


  // --- Effects to sync to store
  $effect(() => {
    if (tryParseDate(startDateValue)) $startDate = startDateValue;
  });

  $effect(() => {
    if (tryParseDate(endDateValue)) $endDate = endDateValue;
  });

  // --- Input sync logic
  function updateEndDateInput() {
    const start = tryParseDate(startDateValue);
    const end = tryParseDate(endDateValue);
    if (!start || !end) return;

    if (isBefore(end, start)) {
      startDateValue = endDateValue;
    }

    if (getYear(end) !== getYear(start)) {
      startDateValue = `${getYear(end)}-01-01`;
    }
  }

  function updateStartDateInput() {
    const start = tryParseDate(startDateValue);
    const end = tryParseDate(endDateValue);
    if (!start || !end) return;

    if (isAfter(start, end)) {
      endDateValue = startDateValue;
    }

    if (getYear(start) !== getYear(end)) {
      const yearEnd = `${getYear(start)}-12-31`;
      endDateValue = isBefore(todayDate, parseISO(yearEnd)) ? today : yearEnd;
    }
  }

  // --- Date presets
  function selectPastWeek() {
    startDateValue = formatDate(subWeeks(todayDate, 1));
    endDateValue = today;

  }

  function selectPastMonth() {
    endDateValue = today;
    startDateValue = formatDate(subMonths(todayDate, 1));
  }

  function selectThisYear() {
    endDateValue = today;
    startDateValue = formatDate(startOfYear(new Date()));
  }

  function selectDefaults() {
    endDateValue = today;
    startDateValue = defaultStartDate || today;
  }

  // --- Optional validation message
  function dateFeedback(dateStr: string): string {
    let date = tryParseDate(dateStr);
    if (!date) return `<< Date required`;
    if (getYear(date) !== getYear(new Date())) return '<< Not current year';
    return '';
  }
</script>

<fieldset id="datepicker" class="border border-gray-300 rounded-md p-4 w-full max-w-md mx-auto">
  <legend class="text-sm font-medium text-gray-700 mb-2">Date Range</legend>

  <!-- Start Date -->
  <label for="datepicker-start" class="text-sm text-gray-700 mb-1">{startLabel}</label>
  <div class="flex items-center gap-2 mb-2" id="datepicker-start-wrapper">
    <!-- svelte-ignore event_directive_deprecated -->
    <!-- svelte-ignore event_directive_deprecated -->
    <input
      type="date"
      class="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
      title={dateToolTip.startDate}
      id="datepicker-start"
      data-testid="datepicker-start"
      bind:value={startDateValue}
      on:focus={updateEndDateInput}
      on:focusout={updateEndDateInput}
      max={today}
      aria-label={startLabel}
    />
    <div class="text-xs text-gray-500 w-1/2 text-center" aria-live="polite">
      {dateFeedback(startDateValue)}
    </div>
  </div>

  <!-- End Date -->
  <label for="datepicker-end" class="text-sm text-gray-700 mb-1">End Date</label>
  <div class="flex items-center gap-2 mb-2" id="datepicker-end-wrapper">
    <!-- svelte-ignore event_directive_deprecated -->
    <input
      type="date"
      class="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
      title={dateToolTip.endDate}
      id="datepicker-end"
      data-testid="datepicker-end"
      bind:value={endDateValue}
      on:focus={updateStartDateInput}
      on:focusout={updateStartDateInput}
      max={today}
      aria-label="End Date"
    />
    <div class="text-xs text-gray-500 w-1/2 text-center" aria-live="polite">
      {dateFeedback(endDateValue)}
    </div>
  </div>

  <!-- Quick Range Label -->
  <div class="text-xs text-gray-600 mt-3 mb-1">Quick date ranges:</div>

  <!-- Preset Buttons -->
  <div class="flex justify-evenly flex-wrap gap-2 text-sm" role="group" aria-label="Quick date range options">
    <!-- svelte-ignore event_directive_deprecated -->
    <button
      title="Set date range to past week"
      data-testid="button-past-week"
      on:click={selectPastWeek}
      class="px-2 py-1 bg-gray-200 border border-gray-300 rounded hover:bg-gray-300 transition"
      aria-label="Past week"
    >
      Past week
    </button>
    <!-- svelte-ignore event_directive_deprecated -->
    <button
      title="Set date range to past month"
      data-testid="button-past-month"
      on:click={selectPastMonth}
      class="px-2 py-1 bg-gray-200 border border-gray-300 rounded hover:bg-gray-300 transition"
      aria-label="Past month"
    >
      Past month
    </button>
    <!-- svelte-ignore event_directive_deprecated -->
    <button
      title="Set date range to Jan 1 -> today"
      data-testid="button-this-year"
      on:click={selectThisYear}
      class="px-2 py-1 bg-gray-200 border border-gray-300 rounded hover:bg-gray-300 transition"
      aria-label="This year"
    >
      This year
    </button>
    <!-- svelte-ignore event_directive_deprecated -->
    <button
      title="Restore default date settings for this model"
      data-testid="button-defaults"
      on:click={selectDefaults}
      class="px-2 py-1 bg-gray-200 border border-gray-300 rounded hover:bg-gray-300 transition"
      aria-label="Defaults"
    >
      Defaults
    </button>
  </div>
</fieldset>
