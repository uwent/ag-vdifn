<style lang="scss">
  @import '../../scss/settings.scss';

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
  import moment from 'moment';
  import { getContext, onDestroy } from 'svelte';
  import { endDate, panelKey, startDate, selectedPest } from '@store';

  const { panelType, dateToolTip, defaultStartDate } = getContext<any>(panelKey);

  let today: string = moment.utc().subtract(1, 'day').format('YYYY-MM-DD');
  let endDateValue: string = today;
  let defaultEndDateValue = endDateValue;
  let startDateValue: string = defaultStartDate;
  let defaultStartDateValue = startDateValue;
  let startLabel = 'Start date';

  // handle end date changes
  // allow end date to push start date forward and update
  // if end date moves to different year start date set to Jan 1 of same year
  function updateStartDateInput() {
    const start = moment.utc(startDateValue);
    const end = moment.utc(endDateValue);

    if (end < start) startDateValue = endDateValue;

    if (end.format('YYYY') != start.format('YYYY')) {
      startDateValue = end.format('YYYY') + '-01-01';
    }
  }

  // handle start date changes
  // allow start date to push end date backward
  // if start date moves to different year end date follows
  function updateEndDateInput() {
    const start = moment.utc(startDateValue);
    const end = moment.utc(endDateValue);

    if (start > end) endDateValue = startDateValue;

    if (start.format('YYYY') != end.format('YYYY')) {
      if (today < start.format('YYYY') + '-12-31') {
        endDateValue = today;
      } else {
        endDateValue = start.format('YYYY') + '-12-31';
      }
    }
  }

  function selectPastWeek() {
    endDateValue = today;
    startDateValue = moment.utc().subtract(1, 'week').format('YYYY-MM-DD');
  }

  function selectPastMonth() {
    endDateValue = today;
    startDateValue = moment.utc().subtract(1, 'month').format('YYYY-MM-DD');
  }

  function selectThisYear() {
    endDateValue = today;
    startDateValue = moment.utc().format('YYYY') + '-01-01';
  }

  function selectDefaults() {
    endDateValue = defaultEndDateValue;
    startDateValue = defaultStartDateValue;
  }

  function isPastYear(date: string) {
    return moment.utc(date).format('YYYY') != moment.utc().format('YYYY');
  }

  // panel and pest-specific tweaks to datepicker
  const unsubscribe = selectedPest.subscribe((pest) => {
    if (panelType != 'custom') {
      startLabel = pest.biofix_label || 'Start date';

      // if biofix has yet to occur default to last year
      if (pest.biofix_date) {
        if (pest.biofix_date < today) {
          defaultStartDateValue = pest.biofix_date;
          defaultEndDateValue = today;
        } else {
          defaultStartDateValue = moment
            .utc(pest.biofix_date)
            .subtract(1, 'year')
            .format('YYYY-MM-DD');
          defaultEndDateValue = moment.utc(defaultStartDateValue).format('YYYY') + '-12-31';
        }
        startDateValue = defaultStartDateValue;
        endDateValue = defaultEndDateValue;
      }
    }
  });

  onDestroy(unsubscribe);

  $: $startDate = startDateValue;
  $: $endDate = endDateValue;
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
      on:focus={updateEndDateInput}
      on:focusout={updateEndDateInput}
      max={today}
    />
    {#if isPastYear(startDateValue)}
      <div class="datepicker-tooltip">&lt;- Not current year</div>
    {/if}
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
      on:focus={updateStartDateInput}
      on:focusout={updateStartDateInput}
      max={today}
    />
    {#if isPastYear(endDateValue)}
      <div class="datepicker-tooltip">&lt;- Not current year</div>
    {/if}
  </div>
  <div class="clear" />
  <div class="label-text">Quick date ranges:</div>
  <div class="preset-buttons">
    <button
      title="Set date range to past week"
      data-testid="button-past-week"
      on:click={selectPastWeek}
    >
      Past week
    </button>
    <button
      title="Set date range to past month"
      data-testid="button-past-month"
      on:click={selectPastMonth}
    >
      Past month
    </button>
    <button
      title="Set date range to Jan 1 -> today"
      data-testid="button-this-year"
      on:click={selectThisYear}
    >
      This year
    </button>
    <button
      title="Restore default date settings for this model"
      data-testid="button-defaults"
      on:click={selectDefaults}
    >
      Defaults
    </button>
  </div>
</fieldset>
