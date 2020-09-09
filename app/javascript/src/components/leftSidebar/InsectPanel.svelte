<script lang="ts">
  const moment = require("moment");
  import { setContext } from "svelte";
  import {
    overlayLoading,
    afflictionValue,
    endDate,
    panelKey,
    startDate,
    afflictionParams,
  } from "../../store/store";
  import ModelSelection from "./ModelSelection.svelte";
  import ModelParameters from "./ModelParameters.svelte";
  import DatePicker from "./DatePicker.svelte";
  import TminMaxDisplay from "./TminMaxDisplay.svelte";
  import Button from "../common/Button.svelte";
  import Loading from "../common/Loading.svelte";
  export let data;

  setContext(panelKey, {
    getCrops: () => data,
    dateToolTip: {
      startDate: "Biofix date for insect",
      endDate: "Date through which degree days are accumulated",
      startLabel: "Biofix",
    },
    getAfflictionName: () => "Insect",
    defaultStartDate: moment.utc().subtract(1, "week").format("YYYY-MM-DD"),
  });

  function submit() {
    afflictionParams.set({
      start_date: moment.utc($startDate).format("YYYY-MM-DD"),
      end_date: moment.utc($endDate).format("YYYY-MM-DD"),
      pest_id: $afflictionValue,
    });
  }
</script>

<div title="Insect Parameters">
  <ModelSelection />
  <ModelParameters>
    <DatePicker />
    <TminMaxDisplay />
  </ModelParameters>
  <Button disabled={$overlayLoading} click={submit} />
  {#if $overlayLoading}
    <Loading />
  {/if}
</div>
