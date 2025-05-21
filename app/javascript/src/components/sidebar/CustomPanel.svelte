<script lang="ts">
  import { format, startOfYear, parseISO } from 'date-fns';
  import { onMount, setContext } from 'svelte';
  import DatePicker from './DatePicker.svelte';
  import TminMaxDisplay from './TminMaxDisplay.svelte';
  import CustomModelSelection from './CustomModelSelection.svelte';
  import CustomGradientType from './CustomGradientType.svelte';
  import LoadStatus from '@components/common/LoadStatus.svelte';
  import CustomGradient from './CustomGradient.svelte';
  import CustomPanelParams from './CustomPanelParams.svelte';
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
    mapRange,
  } from '@store';

  const { data } = $props<{ data: any }>();
  const thisPanel = 'custom';

  setContext(panelKey, {
    panelType: thisPanel,
    getModels: () => data,
    dateToolTip: {
      startDate: 'Biofix',
      endDate: 'Date through which degree-days are accumulated',
    },
    defaultStartDate: format(startOfYear(new Date()), 'yyyy-MM-dd'),
  });

  function submit() {
    $customOverlaySubmitted = true;
    let params = {
      start_date: format(parseISO($startDate), 'yyyy-MM-dd'),
      end_date: format(parseISO($endDate), 'yyyy-MM-dd'),
      t_min: $tMinTmax.t_min,
      t_max: $tMinTmax.t_max,
      in_f: $tMinTmax.in_f,
      ...extents[$mapExtent],
    };

    $customPanelState = {
      ...$customPanelState,
      selectedExtent: $mapExtent,
      selectedModel: $selectedDDModel,
      params: params,
      loaded: true,
    };

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

  $effect(() => {
    if ($selectedPanel == thisPanel && $customPanelState?.loaded) {
      if ($customPanelState?.selectedExtent != $mapExtent) submit();
      if ($customPanelState?.params.t_min != $tMinTmax.t_min) submit();
    }
  });
</script>

<div
  data-testid="custom-panel"
  role="region"
  aria-label="Custom degree-day parameters"
  class="max-w-2xl mx-auto"
>
  <!-- Model Params -->
  <fieldset class="border border-gray-300 p-4 rounded-lg mb-6">
    <legend class="text-lg font-semibold mb-2">Model Parameters</legend>
    <div class="flex flex-col gap-4">
      <DatePicker />
      <CustomModelSelection />
      <TminMaxDisplay />
      <Button
        title="Submit parameters. Data load may take several seconds."
        disabled={$overlayLoading}
        click={submit}
      />
    </div>
  </fieldset>

  <!-- Loading or Results -->
  {#if $overlayLoading}
    <Loading />
  {:else}
    <LoadStatus loaded={$customPanelState.loaded} />

    {#if $customOverlaySubmitted}
      <fieldset class="border border-gray-300 p-4 rounded-lg mb-6">
        <legend class="text-lg font-semibold mb-2">Current Overlay Parameters</legend>
        <div class="flex flex-col gap-4">
          <CustomPanelParams />
          <CustomGradientType />
          <CustomGradient />

          {#if $mapRange}
            <div class="text-sm italic text-center mt-2" title="Map range">
              Map range: {Math.round($mapRange.min * 10) / 10} - {Math.round($mapRange.max * 10) /
                10} degree days
            </div>
          {/if}
        </div>
      </fieldset>
    {/if}
  {/if}
</div>
