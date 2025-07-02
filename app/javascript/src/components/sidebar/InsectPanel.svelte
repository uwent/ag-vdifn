<script lang="ts">
  import { format, parseISO, startOfYear } from 'date-fns';
  import { onMount, setContext } from 'svelte';
  import ModelSelection from './ModelSelection.svelte';
  import DatePicker from './DatePicker.svelte';
  import TminMaxDisplay from './TminMaxDisplay.svelte';
  import SubmitButton from '../common/SubmitButton.svelte';
  import Loading from '../common/Loading.svelte';
  import LoadStatus from '../common/LoadStatus.svelte';
  import Frame from '../common/Frame.svelte';
  import {
    defaults,
    endDate,
    extents,
    insectPanelParams,
    insectPanelState,
    mapExtent,
    overlayLoading,
    panelKey,
    pestId,
    selectedInsect,
    selectedPanel,
    selectedPest,
    startDate,
    tMinTmax,
  } from '@store';
  import type { PanelType } from '@types';

  let {
    data = undefined,
    initialModelName = defaults.insect,
    submitOnLoad = false,
  } = $props<{
    data: any;
    initialModelName: string;
    submitOnLoad: boolean;
  }>();

  const thisPanel: PanelType = 'insect';

  if ($insectPanelState?.loaded) {
    let pest = $insectPanelState.selectedPest;
    $selectedInsect = pest;
    initialModelName = pest.local_name;
    // submitOnLoad = false;
  } else {
    if ($selectedInsect) initialModelName = $selectedInsect.local_name;
  }
  setInsectPanelURL();

  setContext(panelKey, {
    panelType: thisPanel,
    getCrops: () => data,
    getPestName: () => 'Insect',
    dateToolTip: {
      startDate: 'Biofix date for insect',
      endDate: 'Date through which degree days are accumulated',
      startLabel: 'Biofix',
    },
    defaultStartDate: format(startOfYear(new Date()), 'yyyy-MM-dd'),
  });

  function submit() {
    let pest = $selectedInsect;
    let params = {
      start_date: format(parseISO($startDate), 'yyyy-MM-dd'),
      end_date: format(parseISO($endDate), 'yyyy-MM-dd'),
      pest_id: $pestId,
      t_min: $tMinTmax.t_min,
      t_max: $tMinTmax.t_max,
      in_f: $tMinTmax.in_f,
      ...extents[$mapExtent],
    };
    $insectPanelState = {
      ...$insectPanelState,
      selectedPest: pest,
      selectedExtent: $mapExtent,
      mapExtent: extents[$mapExtent],
      loaded: true,
    };
    $insectPanelParams = params;
    setInsectPanelURL();
    gtag('event', 'submit', {
      panel_name: thisPanel,
      model_name: pest.name,
      map_extent: $mapExtent,
    });
  }

  function setInsectPanelURL() {
    let title = 'VDIFN | Insect models';
    let url = window.location.pathname;
    let pest = $insectPanelState.selectedPest;
    url += '?type=' + thisPanel;
    if (pest) {
      initialModelName = pest.local_name;
      url += '&model=' + pest.local_name;
      title = `VDIFN | ${pest.name} model`;
    }
    window.history.replaceState({}, '', url);
    document.title = title;
  }

  onMount(() => {
    $selectedPanel = thisPanel;
    const params = $insectPanelParams;
    if (params) {
      $startDate = params.start_date;
      $endDate = params.end_date;
      $pestId = params.pest_id;
    }
    if (submitOnLoad) submit();
  });

  $effect(() => {
    if ($insectPanelState.loaded && $insectPanelState.selectedExtent !== $mapExtent) {
      submit();
    }
  });

  $effect(() => {
    $selectedPest = $selectedInsect;
  });
</script>

<div class="flex flex-col gap-4">
  <ModelSelection initialModel={initialModelName} />

  <Frame title="Model Parameters">
    <div class="flex flex-col gap-2">
      <DatePicker />
      <TminMaxDisplay />
    </div>
  </Frame>

  <SubmitButton
    title="Submit parameters. Data load may take several seconds."
    disabled={$overlayLoading}
    click={submit}
  />

  {#if $overlayLoading}
    <Loading />
  {:else}
    <LoadStatus loaded={$insectPanelState.loaded} />
  {/if}
</div>
