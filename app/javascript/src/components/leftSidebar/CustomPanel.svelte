<style>
</style>

<script lang="ts">
  import moment from 'moment';
  import { onMount, setContext } from 'svelte';

  import ModelParameters from './ModelParameters.svelte';
  import DatePicker from './DatePicker.svelte';
  import SeverityGradient from './SeverityGradient.svelte';
  import CustomModelSelection from './CustomModelSelection.svelte';
  import TminMaxDisplay from './TminMaxDisplay.svelte';
  import Button from '../common/Button.svelte';
  import Loading from '../common/Loading.svelte';
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
  } from '@store';
  import LoadStatus from '@components/common/LoadStatus.svelte';

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
    $customOverlaySubmitted = true;
    let params = {
      start_date: moment.utc($startDate).format('YYYY-MM-DD'),
      end_date: moment.utc($endDate).format('YYYY-MM-DD'),
      t_min: $tMinTmax.t_min,
      t_max: $tMinTmax.t_max,
      in_f: $tMinTmax.in_f,
      ...extents[$mapExtent],
    };
    customPanelState.update((state) => ({
      ...state,
      selectedExtent: $mapExtent,
      selectedModel: $selectedDDModel,
      params: params,
      loaded: true,
    }));
    $customPanelParams = params;
    setCustomPanelURL();
    gtag('event', 'submit', {
      panel_name: thisPanel,
      model_name: `Degree day (${$tMinTmax.t_min}/${$tMinTmax.t_max})`,
      map_extent: $mapExtent,
    });
  }

  function setCustomPanelURL() {
    let title = 'VDIFN | Degree-day maps';
    let url = window.location.pathname + '?type=custom';
    window.history.replaceState({}, '', url);
    document.title = title;
  }

  onMount(() => {
    $selectedPanel = thisPanel;
    if ($customPanelState.loaded && $customPanelState.selectedModel)
      $selectedDDModel = $customPanelState.selectedModel;
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
  {#if $overlayLoading}
    <Loading />
  {:else}
    <LoadStatus loaded={$customPanelState.loaded} />
    {#if $customOverlaySubmitted}
      <ModelParameters title={'Current Overlay Parameters'}>
        <SeverityGradient />
      </ModelParameters>
    {/if}
  {/if}
</div>
