<script lang="ts">
  import { getContext, onDestroy, onMount } from 'svelte'
  import {
    endDate,
    panelKey,
    startDate,
    selectedAffliction,
  } from '../../store/store'
  import { PestInfo } from '../common/TypeScript/types'
  import QuestionSvg from '../common/SVG/QuestionSvg.svelte'

  const moment = require('moment')
  const { panelType, dateToolTip, defaultStartDate } = getContext(panelKey)

  let today: string = moment.utc().format('YYYY-MM-DD')
  let endDateValue: string = today
  let defaultEndDateValue = endDateValue
  let startDateValue: string = defaultStartDate
  let defaultStartDateValue = startDateValue
  let startLabel = dateToolTip.startLabel

  // handle end date changes
  // allow end date to push start date forward and update
  // if end date moves to different year start date set to Jan 1 of same year
  function updateStartDateInput() {
    const start = moment.utc(startDateValue)
    const end = moment.utc(endDateValue)
    
    if (end < start) startDateValue = endDateValue
    
    if (end.format('YYYY') != start.format('YYYY')) {
      startDateValue = end.format('YYYY') + '-01-01'
    }
  }

  // handle start date changes
  // allow start date to push end date backward
  // if start date moves to different year end date follows
  function updateEndDateInput() {
    const start = moment.utc(startDateValue)
    const end = moment.utc(endDateValue)

    if (start > end) endDateValue = startDateValue

    if (start.format('YYYY') != end.format('YYYY')) {
      if (today < start.format('YYYY') + '-12-31') {
        endDateValue = today
      } else {
        endDateValue = start.format('YYYY') + '-12-31'
      }
    }
  }

  function selectPastWeek() {
    endDateValue = today
    startDateValue = moment.utc().subtract(1, 'week').format('YYYY-MM-DD')
  }

  function selectPastMonth() {
    endDateValue = today
    startDateValue = moment.utc().subtract(1, 'month').format('YYYY-MM-DD')
  }

  function selectThisYear() {
    endDateValue = today
    startDateValue = moment.utc().format('YYYY') + '-01-01'
  }

  function selectDefaults() {
    endDateValue = defaultEndDateValue
    startDateValue = defaultStartDateValue
  }

  function isPastYear(date: string) {
    return moment.utc(date).format('YYYY') != moment.utc().format('YYYY')
  }

  // panel and pest-specific tweaks to datepicker
  const unsubscribe = selectedAffliction.subscribe((affliction: PestInfo) => {
    if (affliction.name) {
      if (panelType === 'Insect') {
        startLabel =
          dateToolTip.startLabel +
          ' (Default: ' +
          moment.utc(affliction.biofix_date).format('MMM D') +
          ')'
      } else if (affliction.name.includes('Early Blight')) {
        startLabel = "Date of emergence"
      } else {
        startLabel = dateToolTip.startLabel
      }
    }

    // if biofix has yet to occur default to last year
    if (affliction.biofix_date) {
      if (affliction.biofix_date < today) {
        defaultStartDateValue = affliction.biofix_date
        defaultEndDateValue = today
      } else {
        defaultStartDateValue = moment
          .utc(affliction.biofix_date)
          .subtract(1, 'year')
          .format('YYYY-MM-DD')
        defaultEndDateValue = moment.utc(defaultStartDateValue).format('YYYY') + '-12-31'
      }
      startDateValue = defaultStartDateValue
      endDateValue = defaultEndDateValue
    }
  })

  onDestroy(unsubscribe)

  onMount(() => {
    startDate.set(startDateValue)
    endDate.set(endDateValue)
  })

  $: startDate.set(startDateValue)
  $: endDate.set(endDateValue)
</script>

<style type="scss">
  @import '../../scss/settings.scss';

  .select-wrapper {
    display: flex;
  }

  fieldset {
    margin-bottom: 10px;
    padding: 10px;
  }

  label {
    color: #484848;
    font-size: 0.75em;
    padding: 0 5px;
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
  }
</style>

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
      on:change={updateEndDateInput}
      max={today} />
    {#if isPastYear(startDateValue)}
      <div class="datepicker-tooltip">
        &lt;- Not current year
      </div>
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
      on:change={updateStartDateInput}
      max={today} />
    {#if isPastYear(startDateValue)}
      <div class="datepicker-tooltip">
        &lt;- Not current year
      </div>
    {/if}
  </div>
  <div class="clear" />
  <label for="preset-buttons">Quick date ranges:</label>
  <div class="preset-buttons">
    <button
    data-testid="button-past-week"
    on:click={selectPastWeek}>
      Past week
    </button>
    <button
    data-testid="button-past-month"
    on:click={selectPastMonth}>
      Past month
    </button>
    <button
    data-testid="button-this-year"
    on:click={selectThisYear}>
      This year
    </button>
    <button
    data-testid="button-defaults"
    on:click={selectDefaults}>
      Defaults
    </button>
  </div>
</fieldset>
