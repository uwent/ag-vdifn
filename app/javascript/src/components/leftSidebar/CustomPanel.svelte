<script lang="ts">
  const moment = require('moment')
  export let data
  import { onMount, setContext } from 'svelte'
  import ModelParameters from './ModelParameters.svelte'
  import DatePicker from './DatePicker.svelte'
  import TminMaxInteractable from './TminMaxInteractable.svelte'
  import SeverityGradient from './SeverityGradient.svelte'
  import CustomModelSelection from './CustomModelSelection.svelte'
  import TminMaxDisplay from './TminMaxDisplay.svelte'
  import {
    customOverlaySubmitted,
    endDate,
    panelKey,
    startDate,
    customPanelParams,
    tMinTmax,
    overlayLoading,
    selectedPanel,
    PANELS,
    customPanelState,
  } from '../../store/store'
  import Button from '../common/Button.svelte'
  import Loading from '../common/Loading.svelte'
  const buttonText = 'Submit'
  let submitDisabled = false
  let tMinTmaxSelection = 'custom'
  const _ = require('lodash')

  setContext(panelKey, {
    panelType: 'Custom',
    getCrops: () => data,
    dateToolTip: {
      startDate: 'Biofix',
      endDate: 'Date through which degree-days are accumulated',
      startLabel: 'Start Date',
    },
    getAfflictionName: () => 'Custom Model',
    defaultStartDate: moment.utc().startOf('year').format('YYYY-MM-DD'),
  })

  function submit() {
    customOverlaySubmitted.set(true)
    customPanelState.update((state) => ({
      ...state,
      t_min: $tMinTmax.t_min,
      t_max: $tMinTmax.t_max,
      in_fahrenheit: $tMinTmax.in_fahrenheit,
    }))
    customPanelParams.set({
      start_date: moment.utc($startDate).format('YYYY-MM-DD'),
      end_date: moment.utc($endDate).format('YYYY-MM-DD'),
      t_min: $tMinTmax.t_min,
      t_max: $tMinTmax.t_max,
      in_fahrenheit: $tMinTmax.in_fahrenheit,
    })
  }

  function handleCustomTminTMax(event) {
    submitDisabled = !event.detail.valid
  }

  onMount(() => {
    selectedPanel.set(PANELS.CUSTOM)
    submit()
  })
</script>

<style>
  .tMinTMaxOptions {
    display: flex;
    margin: 15px;
    overflow: hidden;
    justify-content: center;
  }

  .tMinTMaxOptions input {
    position: absolute !important;
    clip: rect(0, 0, 0, 0);
    height: 1px;
    width: 1px;
    border: 0;
    overflow: hidden;
  }

  .tMinTMaxOptions label {
    background-color: #e4e4e4;
    color: rgba(0, 0, 0, 0.6);
    font-size: 14px;
    line-height: 1;
    text-align: center;
    padding: 8px 16px;
    margin-right: -1px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3),
      0 1px rgba(255, 255, 255, 0.1);
    transition: all 0.1s ease-in-out;
  }

  .tMinTMaxOptions label:hover {
    cursor: pointer;
  }

  .tMinTMaxOptions input:checked + label {
    background-color: #a5dc86;
    box-shadow: none;
  }

  .tMinTMaxOptions label:first-of-type {
    border-radius: 4px 0 0 4px;
  }

  .tMinTMaxOptions label:last-of-type {
    border-radius: 0 4px 4px 0;
  }
</style>

<div>
  <ModelParameters>
    <DatePicker />
    <label class="tMinTMaxOptions" for="TminTMaxOptions">
      Choose Tmin/Tmax from:
    </label>
    <div class="tMinTMaxOptions">
      <input
        type="radio"
        name="customTminTmax"
        id="customTminTmax"
        value="custom"
        bind:group={tMinTmaxSelection} />
      <label for="customTminTmax">Custom values</label>
      <input
        type="radio"
        name="tMinMaxModelSelection"
        id="tMinMaxModelSelection"
        value="modelSelection"
        bind:group={tMinTmaxSelection} />
      <label for="tMinMaxModelSelection">Existing model</label>
    </div>
    {#if tMinTmaxSelection === 'modelSelection'}
      <CustomModelSelection />
      <TminMaxDisplay />
    {:else}
      <TminMaxInteractable on:tMinMaxValid={handleCustomTminTMax} />
    {/if}
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
