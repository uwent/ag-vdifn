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
  let startDateValue: string = defaultStartDate
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

    if (affliction.biofix_date) {
      if (affliction.biofix_date < today) {
        startDateValue = affliction.biofix_date
        endDateValue = today
      } else {
        startDateValue = moment
          .utc(affliction.biofix_date)
          .subtract(1, 'year')
          .format('YYYY-MM-DD')
        endDateValue = moment.utc(startDateValue).format('YYYY') + '-12-31'
      }
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
  }

  button {
    border: none;
  }
</style>

<fieldset id="datepicker">
  <legend>Date Range</legend>
  <label for="datepicker-start">{startLabel}</label>
  <div class="select-wrapper" id="datepicker-start-wrapper">
    <input
      type="date"
      class="datepicker"
      title="Start date/biofix"
      id="datepicker-start"
      data-testid="datepicker-start"
      bind:value={startDateValue}
      on:change={updateEndDateInput}
      max={today} />
    <button
      class="datepicker-tooltip"
      id="datepicker-start-information"
      data-testid="start-date-tooltip"
      data-balloon-length="small"
      data-balloon-pos="right"
      aria-label={dateToolTip.startDate}>
      <QuestionSvg />
    </button>
  </div>
  <label for="datepicker-end">End Date</label>
  <div class="select-wrapper" id="datepicker-end-wrapper">
    <input
      type="date"
      class="datepicker"
      title="End date"
      id="datepicker-end"
      data-testid="datepicker-end"
      bind:value={endDateValue}
      on:change={updateStartDateInput}
      max={today} />
    <button
      class="datepicker-tooltip"
      id="datepicker-end-information"
      data-testid="end-date-tooltip"
      data-balloon-length="small"
      data-balloon-pos="right"
      aria-label={dateToolTip.endDate}>
      <QuestionSvg />
    </button>
  </div>
</fieldset>
