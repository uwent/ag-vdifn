<script lang="ts">
  const moment = require('moment');
  import { getContext, onDestroy, onMount } from 'svelte';
  import { endDate, panelKey, startDate, selectedAffliction } from '../../store/store'
  import { PestInfo } from '../common/TypeScript/types';
  import QuestionSvg from '../common/SVG/QuestionSvg.svelte'
  let startLabel;
  let today: string = moment.utc().format("YYYY-MM-DD");
  let endDateValue: string = today;
  let lastWeek: string = moment.utc().subtract(1, 'week').format("YYYY-MM-DD");
  let startDateValue: string = lastWeek;
  let startDateMax: string = endDateValue;

  function updateStartDateMax(endDate) {
    startDateMax = endDate;
  }

  const { dateToolTip } = getContext(panelKey)
  startLabel = dateToolTip.startLabel;
  onMount(() => {
    startDate.set(lastWeek)
    endDate.set(today);
  })
  const unsubscribe = selectedAffliction.subscribe((affliction: PestInfo) => {
    if (affliction.biofix_date) {
      startDateValue = affliction.biofix_date
    }
  })
  onDestroy(unsubscribe);

  $: updateStartDateMax(endDateValue);
  $: startDate.set(startDateValue);
  $: endDate.set(endDateValue);

</script>

<fieldset id="datepicker">
  <legend>Date Range</legend>
    <label for='datepicker-start'>
      {startLabel}
    </label>
    <div class="select-wrapper" id="datepicker-start-wrapper">
      <input type="date" class="datepicker" id="datepicker-start" bind:value={startDateValue} max={startDateMax}>
      <span class="tooltip datepicker-tooltip" id="datepicker-start-information" title='start-date-tooltip' data-tooltip={dateToolTip.startDate}><QuestionSvg /></span>
    </div>
    <label for='datepicker-end'>End Date</label>
    <div class="select-wrapper" id="datepicker-end-wrapper">
      <input type="date" class="datepicker" id="datepicker-end" bind:value={endDateValue} max={today} disabled={!$selectedAffliction.end_date_enabled}>
      <div class="tooltip datepicker-tooltip" id="datepicker-end-information" title='end-date-tooltip' data-tooltip={dateToolTip.endDate}><QuestionSvg /></div>
    </div>
</fieldset>

<style>

  .select-wrapper {
    display: flex;
  }

  fieldset {
    background: rgba(200, 200, 200, 0.4);
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

</style>

