<script lang="ts">
  const moment = require("moment");
  import { getContext, onDestroy, onMount } from "svelte";
  import {
    endDate,
    panelKey,
    startDate,
    selectedAffliction,
  } from "../../store/store";
  import { PestInfo } from "../common/TypeScript/types";
  import QuestionSvg from "../common/SVG/QuestionSvg.svelte";
  const { dateToolTip, defaultStartDate } = getContext(panelKey);
  let today: string = moment.utc().format("YYYY-MM-DD");
  let endDateValue: string = today;
  let startDateMax: string = endDateValue;
  let startDateValue: string = defaultStartDate;
  let startLabel = dateToolTip.startLabel;
  let startMin = moment.utc().subtract(7, "days")

  function updateStartDateInput(event) {
    const {
      target: { value },
    } = event;
    startDateMax = value;
    if (moment.utc(endDateValue) < moment.utc(startDateValue)) {
      startDateValue = value;
    }
  }

  function updateLateBlightEndDate(event) {
    selectedAffliction.subscribe((affliction: PestInfo) => {
      if (affliction.name === "Late Blight" && moment.utc(startDateValue) <= startMin) {
        endDateValue = moment(startDateValue).add(7, "days").format("YYYY-MM-DD")
      }
      else if (affliction.name === "Late Blight" && moment.utc(startDateValue) >= startMin) {
        endDateValue = today
      }
    });
  }

  onMount(() => {
    startDateValue = defaultStartDate;
    startDate.set(defaultStartDate);
    endDate.set(today);
  });

  const unsubscribe = selectedAffliction.subscribe((affliction: PestInfo) => {
    if (affliction.biofix_date && affliction.biofix_date < today) {
      startDateValue = affliction.biofix_date;
    } else if (affliction.biofix_date && affliction.biofix_date >= today) {
      startDateValue = moment.utc(affliction.biofix_date).subtract(1, "year").format("YYYY-MM-DD");
    }
  });

  onDestroy(unsubscribe);

  $: startDate.set(startDateValue);
  $: endDate.set(endDateValue);
</script>

<style type="scss">
  @import "../../scss/settings.scss";

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
  <label for="datepicker-start"> {startLabel} </label>
  <div class="select-wrapper" id="datepicker-start-wrapper">
    <input
      type="date"
      class="datepicker"
      id="datepicker-start"
      bind:value={startDateValue}
      on:change={updateLateBlightEndDate}
      max={startDateMax} />
    <button
      class="datepicker-tooltip"
      id="datepicker-start-information"
      title="start-date-tooltip"
      data-balloon-length="small"
      data-balloon-pos="right"
      aria-label={dateToolTip.startDate}><QuestionSvg /></button>
  </div>
  <label for="datepicker-end">End Date</label>
  <div class="select-wrapper" id="datepicker-end-wrapper">
    <input
      type="date"
      class="datepicker"
      id="datepicker-end"
      bind:value={endDateValue}
      on:change={updateStartDateInput}
      disabled={!$selectedAffliction.end_date_enabled}
      max={today} />
    <button
      class="datepicker-tooltip"
      id="datepicker-end-information"
      title="end-date-tooltip"
      data-balloon-length="small"
      data-balloon-pos="right"
      aria-label={dateToolTip.endDate}><QuestionSvg /></button>
  </div>
</fieldset>
