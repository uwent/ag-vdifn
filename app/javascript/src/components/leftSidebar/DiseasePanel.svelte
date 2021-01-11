<script lang="ts">
  const moment = require("moment");
  import { onMount, setContext } from "svelte";
  import {
    overlayLoading,
    afflictionValue,
    endDate,
    panelKey,
    startDate,
    diseasePanelParams,
    selectedPanel,
    diseasePanelState,
    selectedAffliction,
    PANELS
  } from "../../store/store";
  import { get } from 'svelte/store';
  import ModelSelection from "./ModelSelection.svelte";
  import ModelParameters from "./ModelParameters.svelte";
  import DatePicker from "./DatePicker.svelte";
  import Button from "../common/Button.svelte";
  import Loading from "../common/Loading.svelte";
  export let data;

  setContext(panelKey, {
    getCrops: () => data,
    dateToolTip: {
      startDate: "Date of Emergence/Last Fungicide Application",
      endDate: "Date through which disease severity values are accumulated",
      startLabel: "Date of Emergence/Last Fungicide Application",
    },
    getAfflictionName: () => "Disease",
    defaultStartDate: moment.utc().subtract(1, "week").format("YYYY-MM-DD"),
  });

  // const submit = () => {
  //   diseasePanelState.update(state => ({...state, currentAffliction: get(selectedAffliction)}))
  //   diseasePanelParams.set({
  //     start_date: moment.utc($startDate).format("YYYY-MM-DD"),
  //     end_date: moment.utc($endDate).format("YYYY-MM-DD"),
  //     pest_id: $afflictionValue,
  //   });
  // };


  function submit() {
    diseasePanelState.update(state => ({...state, currentAffliction: get(selectedAffliction)}));
    diseasePanelParams.set({
      start_date: moment.utc($startDate).format("YYYY-MM-DD"),
      end_date: moment.utc($endDate).format("YYYY-MM-DD"),
      pest_id: $afflictionValue,
    });
  };

  onMount(() => {
    selectedPanel.set(PANELS.DISEASE);
    submit();
  })
</script>

<style>
  div {
    display: flex;
    flex-direction: column;
  }
</style>

<div title="Disease model selection">
  <ModelSelection />
  <ModelParameters>
    <DatePicker />
  </ModelParameters>
  <Button disabled={$overlayLoading} click={submit} />
  {#if $overlayLoading}
    <Loading />
  {/if}
</div>
