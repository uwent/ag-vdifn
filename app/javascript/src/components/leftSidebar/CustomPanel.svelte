<style>
  /* .tMinTMaxOptions {
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
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px rgba(255, 255, 255, 0.1);
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
  } */
</style>

<script lang="ts">
  import moment from 'moment';
  import { onMount, setContext } from 'svelte';
  import {
    customOverlaySubmitted,
    endDate,
    panelKey,
    startDate,
    customPanelParams,
    tMinTmax,
    overlayLoading,
    selectedPanel,
    customPanelState,
    selectedDDModel,
    extents,
    mapExtent,
  } from '../../store/store';
  import ModelParameters from './ModelParameters.svelte';
  import DatePicker from './DatePicker.svelte';
  import SeverityGradient from './SeverityGradient.svelte';
  import CustomModelSelection from './CustomModelSelection.svelte';
  import TminMaxDisplay from './TminMaxDisplay.svelte';
  import Button from '../common/Button.svelte';
  import Loading from '../common/Loading.svelte';
  export let data: any;
  const thisPanel = 'custom';

  setContext(panelKey, {
    panelType: thisPanel,
    getModels: () => data,
    dateToolTip: {
      startDate: 'Biofix',
      endDate: 'Date through which degree-days are accumulated',
    },
    defaultStartDate: moment.utc().startOf('year').format('YYYY-MM-DD'),
  });

  function submit() {
    customOverlaySubmitted.set(true);
    let params = {
      start_date: moment.utc($startDate).format('YYYY-MM-DD'),
      end_date: moment.utc($endDate).format('YYYY-MM-DD'),
      t_min: $tMinTmax.t_min,
      t_max: $tMinTmax.t_max,
      in_fahrenheit: $tMinTmax.in_fahrenheit,
      ...extents[$mapExtent],
    };
    customPanelState.update((state) => ({
      ...state,
      selectedExtent: $mapExtent,
      selectedModel: $selectedDDModel,
      params: params,
      loaded: true,
    }));
    customPanelParams.set(params);
    setCustomPanelURL();
    gtag('event', 'submit', {
      panel_name: thisPanel,
      model_name: `Degree day (${$tMinTmax.t_min}/${$tMinTmax.t_max})`,
      map_extent: $mapExtent,
    });
  }

  function setCustomPanelURL() {
    let title = 'Degree-day maps - VDIFN';
    let url = window.location.pathname + '?p=custom';
    window.history.replaceState({}, '', url);
    document.title = title;
  }

  onMount(() => {
    selectedPanel.set(thisPanel);
    if ($customPanelState.loaded && $customPanelState.selectedModel)
      selectedDDModel.set($customPanelState.selectedModel);
    setCustomPanelURL();
  });

  // Submit if map extent doesn't match stored data
  $: if (
    $selectedPanel == thisPanel &&
    $customPanelState.loaded &&
    $customPanelState.selectedExtent != $mapExtent
  )
    submit();
</script>

<div data-testid="custom-panel">
  <ModelParameters>
    <DatePicker />
    <CustomModelSelection />
    <TminMaxDisplay />
    <Button
      title="Submit parameters. Data load may take several seconds."
      disabled={$overlayLoading}
      click={submit}
    />
  </ModelParameters>
  {#if $customOverlaySubmitted && $overlayLoading}
    <Loading />
  {:else if $customOverlaySubmitted}
    <ModelParameters title={'Current Overlay Parameters'}>
      <SeverityGradient />
    </ModelParameters>
  {/if}
</div>
