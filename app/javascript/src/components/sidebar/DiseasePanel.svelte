<script lang="ts">
  import { format, parseISO, subWeeks } from 'date-fns';
  import { onMount, setContext } from 'svelte';

  import ModelSelection from './ModelSelection.svelte';
  import TminMaxDisplay from './TminMaxDisplay.svelte';
  import DatePicker from './DatePicker.svelte';
  import Button from '../common/Button.svelte';
  import Loading from '../common/Loading.svelte';
  import LoadStatus from '@components/common/LoadStatus.svelte';

  import {
    overlayLoading,
    pestId,
    endDate,
    panelKey,
    startDate,
    tMinTmax,
    diseasePanelParams,
    selectedPanel,
    diseasePanelState,
    selectedDisease,
    extents,
    mapExtent,
    defaults,
    selectedPest,
  } from '@store';

  import type { PanelType } from '@types';

  const thisPanel: PanelType = 'disease';

  let {
    data,
    initialModelName = defaults.disease,
    submitOnLoad = false,
  } = $props<{
    data: any;
    initialModelName: string;
    submitOnLoad: boolean;
  }>();

  if ($diseasePanelState.loaded) {
    let pest = $diseasePanelState.selectedPest;
    $selectedDisease = pest;
    initialModelName = pest.local_name;
  } else {
    if ($selectedDisease) initialModelName = $selectedDisease.local_name;
  }

  setDiseasePanelURL();

  setContext(panelKey, {
    panelType: thisPanel,
    getCrops: () => data,
    dateToolTip: {
      startDate: 'Start of date range',
      endDate: 'Date through which disease severity values are accumulated',
      startLabel: 'Start date',
    },
    getPestName: () => 'Disease',
    defaultStartDate: format(subWeeks(new Date(), 1), 'yyyy-MM-dd'),
  });

  function submit() {
    let pest = $selectedDisease;
    let params = {
      start_date: format(parseISO($startDate), 'yyyy-MM-dd'),
      end_date: format(parseISO($endDate), 'yyyy-MM-dd'),
      pest_id: $pestId,
      in_f: $tMinTmax.in_f,
      ...extents[$mapExtent],
    };

    $diseasePanelState = {
  ...$diseasePanelState,
  selectedPest: pest,
  mapExtent: extents[$mapExtent], 
  selectedExtent: $mapExtent,    
  loaded: true,
};

    $diseasePanelParams = params;
    setDiseasePanelURL();

    gtag('event', 'submit', {
      panel_name: thisPanel,
      model_name: pest.name,
      map_extent: $mapExtent,
    });
  }

  function setDiseasePanelURL() {
    let pest = $diseasePanelState.selectedPest;
    let url = window.location.pathname;
    let title = 'VDIFN: Plant disease and insect risk models';
    if (pest) {
      initialModelName = pest.local_name;
      url += '?model=' + pest.local_name;
      title = `VDIFN | ${pest.name} model`;
    }
    window.history.replaceState({}, '', url);
    document.title = title;
  }

  onMount(() => {
    $selectedPanel = thisPanel;
    const params = $diseasePanelParams;
    if (params) {
      $startDate = params.start_date;
      $endDate = params.end_date;
      $pestId = params.pest_id;
    }
    if (submitOnLoad) submit();
  });

  $effect(() => {
  if ($diseasePanelState.loaded && $diseasePanelState.selectedExtent !== $mapExtent) {
    submit();
  }
});

  $effect(() => {
    $selectedPest = $selectedDisease;
  });
</script>

<!-- ✅ UI markup using Tailwind only -->
<div data-testid="disease-panel" class="flex flex-col space-y-4 max-w-xl mx-auto">
  <!-- Crop and Model Selector -->
  <ModelSelection initialModel={initialModelName} />

  <!-- Parameter Inputs -->
  <fieldset class="border border-gray-300 rounded-md p-4">
    <legend class="text-sm font-medium text-gray-700 mb-2">Model parameters</legend>
    <div class="space-y-2">
      <DatePicker />
      <TminMaxDisplay />
    </div>
  </fieldset>

  <!-- Submit Button -->
  <Button
    title="Submit parameters. Data load may take several seconds."
    ariaLabel="Submit parameters"
    disabled={$overlayLoading}
    click={submit}
  />

  <!-- Loading or Load Status -->
  {#if $overlayLoading}
    <Loading />
  {:else}
    <LoadStatus loaded={$diseasePanelState.loaded} />
  {/if}
</div>
