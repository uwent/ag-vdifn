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
  import Frame from '@components/common/Frame.svelte';

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

{#snippet quickBtn(title: string, text: string, onclick: () => void)}
  <button
    class="bg-gray-100 hover:bg-gray-300 px-1.5 py-0.5 border border-gray-300 rounded w-full text-xs transition cursor-pointer"
    {title}
    aria-label={title}
    {onclick}
  >
    {text}
  </button>
{/snippet}

<Frame title="Date Range">
  <label for="datepicker-start" class="block mb-1">{startLabel}</label>
  <div class="flex items-center gap-2 mb-3">
    <input
      type="date"
      class="bg-white px-2 py-1 border border-gray-300 rounded text-sm datepicker"
      title={dateToolTip.startDate}
      id="datepicker-start"
      data-testid="datepicker-start"
      bind:value={startDateValue}
      onfocus={updateEndDateInput}
      onfocusout={updateEndDateInput}
      max={today}
      aria-label={startLabel}
    />
    <div class="w-1/2 text-gray-600 text-xs italic" aria-live="polite">
      {dateFeedback(startDateValue)}
    </div>
  </div>

  <label for="datepicker-end" class="block mb-1">End Date</label>
  <div class="flex items-center gap-2 mb-3">
    <input
      type="date"
      class="bg-white px-2 py-1 border border-gray-300 rounded text-sm datepicker"
      title={dateToolTip.endDate}
      id="datepicker-end"
      data-testid="datepicker-end"
      bind:value={endDateValue}
      onfocus={updateStartDateInput}
      onfocusout={updateStartDateInput}
      max={today}
      aria-label="End Date"
    />
    <div class="w-1/2 text-gray-600 text-xs italic" aria-live="polite">
      {dateFeedback(endDateValue)}
    </div>
  </div>

  <div class="mb-1 text-gray-700 text-m text-sm">Quick date ranges:</div>
  <div
    class="gap-2 grid grid-cols-2 sm:grid-cols-4 w-full text-xs"
    role="group"
    aria-label="Quick date range options"
  >
    {@render quickBtn('Set date range to past week', 'Past week', selectPastWeek)}
    {@render quickBtn('Set date range to past month', 'Past month', selectPastMonth)}
    {@render quickBtn('Set date range to Jan 1 -> today', 'This year', selectThisYear)}
    {@render quickBtn('Restore default date settings for this model', 'Defaults', selectDefaults)}
  </div>
</Frame>
