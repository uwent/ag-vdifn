<script lang="ts">
  const moment = require("moment");
  import { setContext } from "svelte";
  import ModelParameters from "./ModelParameters.svelte";
  import DatePicker from "./DatePicker.svelte";
  import TminMaxInteractable from "./TminMaxInteractable.svelte";
  import SeverityGradient from "./SeverityGradient.svelte";
  import {
    customOverlaySubmitted,
    endDate,
    panelKey,
    startDate,
    customParams,
    tMinTmax,
    overlayLoading,
  } from "../../store/store";
  import Button from "../common/Button.svelte";
  import Loading from "../common/Loading.svelte";
  const buttonText = "Submit";
  let submitDisabled = false;

  setContext(panelKey, {
    getCrops: () => [],
    dateToolTip: {
      startDate: "Biofix",
      endDate: "Date through which severity values are accumulated",
      startLabel: "Start Date",
    },
    getAfflictionName: () => "Custom Model",
    defaultStartDate: moment.utc().dayOfYear(1).format("YYYY-MM-DD"),
  });

  function submit() {
    customOverlaySubmitted.set(true);
    customParams.set({
      start_date: moment.utc($startDate).format("YYYY-MM-DD"),
      end_date: moment.utc($endDate).format("YYYY-MM-DD"),
      t_min: $tMinTmax.t_min,
      t_max: $tMinTmax.t_max,
      in_fahrenheit: $tMinTmax.in_fahrenheit,
    });
  }

  function toggleSubmitButton(event) {
    submitDisabled = !event.detail.valid;
  }
</script>

<div title="Custom Parameters">
  <ModelParameters>
    <DatePicker />
    <TminMaxInteractable on:tMinMaxValid={toggleSubmitButton} />
    <Button
      disabled={submitDisabled || $overlayLoading}
      text={buttonText}
      click={submit} />
  </ModelParameters>
  {#if $customOverlaySubmitted && $overlayLoading}
    <Loading />
  {:else if $customOverlaySubmitted}
    <ModelParameters title={'Current Overlay Parameters'}>
      <SeverityGradient />
    </ModelParameters>
  {:else}
    <ModelParameters title={'Gradient Type'}>
      <p>Please submit model parameters</p>
    </ModelParameters>
  {/if}
</div>
